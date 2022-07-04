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
from.forms import TweetForm
from .models import Tweet
from .serializers import *
from django.conf import settings

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

# Create your views here.
def home_view(request, *args, **kwargs):
    username = None
    if request.user.is_authenticated:
        username = request.user.username
    return render(request, "pages/home.html", context={"username": username}, status=200)

def tweetz_list_view(request, *args, **kwargs):
    username = None
    if request.user.is_authenticated:
        username = request.user.username
    return render(request, "tweet/list.html")

def tweetz_detail_view(request, tweet_id, *args, **kwargs):
    return render(request, "tweet/detail.html", context={"tweet_id": tweet_id})

def tweetz_profile_view(request, username, *args, **kwargs):
    return render(request, "tweet/profile.html", context={"profile_username": username})