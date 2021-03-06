from cgitb import reset
import imp
from django.shortcuts import render # , redirect
# from django.http import HttpResponse, Http404, JsonResponse
# from django.utils.http import url_has_allowed_host_and_scheme
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from tweetzDjango.settings import ALLOWED_HOSTS
from ..forms import TweetForm
from ..models import Tweet
from ..serializers import *
from django.conf import settings

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


@api_view(['POST'])
# @authentication_classes([SessionAuthentication, myCustomAuth]) these two in combination is authentication
@permission_classes([IsAuthenticated])
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetCreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)

@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):
    qs = Tweet.objects.all()
    username = request.GET.get('username')
    if username != None:
        qs = qs.filter(user__username__iexact=username) #iexact helps filter through api of tweets "http://127.0.0.1:8000/api/tweetz/?username=david"
    serializer = TweetSerializer(qs, many=True)
    return Response(serializer.data, status=200)

@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data, status=200)

@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    print(qs)
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({'message': "Denied Permission"}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({'message': 'Success'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tweet_action_view(request, *args, **kwargs):
    serializer = TweetActionSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        tweet_id = data.get('id')
        action = data.get('action')
        content = data.get('content')
        qs = Tweet.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({}, status=404)
        obj = qs.first()
        if action =="like":
            obj.likes.add(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=200)
        elif action =="unlike":
            obj.likes.remove(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=200)
        elif action =="retweet":
            new_tweet = Tweet.objects.create(user=request.user, parent=obj, content=content)
            serializer = TweetSerializer(new_tweet)
            return Response(serializer.data, status=201)
    return Response({'message': 'Action Performed'}, status=200)

# def tweet_create_view_django(request, *args, **kwargs):
#     user = request.user
#     if not request.user.is_authenticated:
#         user = None
#         if request.headers.get('x-requested-with') == 'XMLHttpRequest':
#             return JsonResponse({}, status=401)
#         return redirect(settings.LOGIN_URL)
#     form = TweetForm(request.POST or None)
#     next_url = request.POST.get("next") or None
#     if form.is_valid():
#         obj = form.save(commit=False)
#         obj.user = user
#         obj.save()
#         if request.headers.get('x-requested-with') == 'XMLHttpRequest':
#             return JsonResponse(obj.serialize(), status=201) #201 status normally for creating
#         if next_url != None and url_has_allowed_host_and_scheme(next_url, ALLOWED_HOSTS):
#             return redirect(next_url)
#         form = TweetForm()
#     if form.errors:
#         if request.headers.get('x-requested-with') == 'XMLHttpRequest':
#             return JsonResponse(form.errors, status=400)
#     return render(request, "components/form.html", context={"form": form})

# def tweets_list_view_django(request, *args, **kwargs):
#     """
#     REST API VIEW
#     consumed by JavaScript or Switft/Java/IOS/Android
#     return JSON data
#     """
#     qs = Tweet.objects.all()
#     tweetz_list = [x.serialize() for x in qs]
#     data = {
#         'isUser': False,
#         'response': tweetz_list
#     }
#     return JsonResponse(data)

# def tweet_detail_view_django(request, tweet_id, *args, **kwargs):
#     """
#     REST API VIEW
#     consumed by JavaScript or Switft/Java/IOS/Android
#     return JSON data
#     """
#     data = {
#         "id": tweet_id,
#     }
#     status = 200
#     try :
#         obj = Tweet.objects.get(id=tweet_id)
#         data['content'] = obj.content
#     except:
#         data['message']= "Not found"
#         status = 404
#     return JsonResponse(data, status=status)