# Generated by Django 3.2.7 on 2021-09-13 13:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_product_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='countInStcok',
            new_name='countInStock',
        ),
    ]
