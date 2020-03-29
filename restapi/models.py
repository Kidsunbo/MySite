from django.db import models
import hashlib

kie_token = hashlib.sha256("Kie".encode('utf-8')).hexdigest()
raym_token = hashlib.sha256("Raym".encode('utf-8')).hexdigest()

# Create your models here.
class RecordModel(models.Model):
    date = models.DateField("Record Date")
    AAT = models.IntegerField("AAT Number")
    essay = models.IntegerField("Essay Number")
    other = models.IntegerField("Other Number")
    coding = models.IntegerField("Coding Number")
    note = models.CharField(verbose_name="Note",max_length=140)
    token = models.CharField(verbose_name="Token",max_length=100)

    def __str__(self):
        if self.token ==kie_token:
            return "Kie "+str(self.date)
        elif self.token==raym_token:
            return "Raym "+str(self.date)
