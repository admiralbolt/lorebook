To run first make sure redis is running:

```
sudo docker run -p 6379:6379 -d redis:2.8
```

Then, run the server:

```
python manage.py runserver
```
