from rest_framework import serializers
from panel.models import *

class SongSerializer(serializers.ModelSerializer):

  class Meta:
    model = Song
    fields = '__all__'
