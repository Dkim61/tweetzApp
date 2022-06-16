
from django.contrib import admin
from django.urls import path
from tweet.views import *

urlpatterns = [
    path('', tweets_list_view),
    path('action/<int:tweet_id>/', tweets_action_view),
    path('create/', tweet_create_view),
    path('<int:tweet_id>/', tweets_detail_view),
    path('delete/<int:tweet_id>/', tweets_delete_view),
]
