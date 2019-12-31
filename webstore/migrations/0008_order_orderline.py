# Generated by Django 2.0.3 on 2019-12-29 20:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webstore', '0007_producttype_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fullname', models.CharField(max_length=64)),
                ('address', models.CharField(max_length=127)),
                ('email', models.CharField(max_length=64)),
                ('sum', models.DecimalField(decimal_places=2, max_digits=6)),
            ],
        ),
        migrations.CreateModel(
            name='OrderLine',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lines', to='webstore.Order')),
                ('productType', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='productTypes', to='webstore.ProductType')),
            ],
        ),
    ]
