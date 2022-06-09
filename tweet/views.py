import imp
from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse
from.forms import TweetForm
from .models import Tweet
import random
# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "pages/home.html", context={}, status=200)

def tweet_create_view(request, *args, **kwargs):
    form = TweetForm(request.POST or None)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.save()
        form = TweetForm()
    return render(request, "components/form.html", context={"form": form})

def tweets_list_view(request, *args, **kwargs):
    """
    REST API VIEW
    consumed by JavaScript or Switft/Java/IOS/Android
    return JSON data
    """
    qs = Tweet.objects.all()
    tweetz_list = [{'id': x.id, 'content': x.content, 'likes': random.randint(0, 1213)} for x in qs]
    data = {
        'isUser': False,
        'response': tweetz_list
    }
    return JsonResponse(data)

def tweet_detail_view(request, tweet_id, *args, **kwargs):
    """
    REST API VIEW
    consumed by JavaScript or Switft/Java/IOS/Android
    return JSON data
    """
    data = {
        "id": tweet_id,
    }
    status = 200
    try :
        obj = Tweet.objects.get(id=tweet_id)
        data['content'] = obj.content
    except:
        data['message']= "Not found"
        status = 404
    return JsonResponse(data, status=status)