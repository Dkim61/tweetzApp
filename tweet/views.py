from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse
from .models import Tweet

# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "pages/home.html", context={}, status=200)

def tweets_list_view(request, *args, **kwargs):
    """
    REST API VIEW
    consumed by JavaScript or Switft/Java/IOS/Android
    return JSON data
    """
    qs = Tweet.objects.all()
    tweetz_list = [{'id': x.id, 'content': x.content} for x in qs]
    data = {
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