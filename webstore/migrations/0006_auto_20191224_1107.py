# Generated by Django 2.0.3 on 2019-12-24 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webstore', '0005_auto_20191223_1734'),
    ]

    operations = [
        migrations.AddField(
            model_name='producttype',
            name='color',
            field=models.CharField(max_length=7, null=True),
        ),
        migrations.AlterField(
            model_name='producttype',
            name='number',
            field=models.IntegerField(default=1),
        ),
    ]
