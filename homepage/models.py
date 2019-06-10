from django.db import models
from datetime import datetime
# Create your models here.

class Article(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField(null=False)
    pub_date = models.DateTimeField("Date Published",default=datetime.now())

    def __str__(self):
        return self.title