from rest_framework import serializers

from .models import User
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.hashers import check_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'given_name', 'family_name', 'bio', 'url', 'password']
        read_only_field = ['id']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'given_name', 'family_name', 'bio', 'url']

class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    @staticmethod
    def get_token(user):
        token = AccessToken.for_user(user)
        token['user_email'] = user.email
        return token

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = User.objects.filter(email=email).first()

            if user and check_password(password, user.password):
                token = self.get_token(user)
                data = {
                    'access_token': str(token),
                    'user': UserProfileSerializer(user).data
                }
                return data
            else:
                raise serializers.ValidationError('Invalid email or password.')
        else:
            raise serializers.ValidationError('Email and password are required.')
    
