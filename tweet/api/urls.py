from django.contrib import admin
from django.urls import path
from tweet.api.views import *

urlpatterns = [
    path('', tweet_list_view),
    path('action/', tweet_action_view),
    path('create/', tweet_create_view),
    path('<int:tweet_id>/', tweet_detail_view),
    path('delete/<int:tweet_id>/', tweet_delete_view),
]
