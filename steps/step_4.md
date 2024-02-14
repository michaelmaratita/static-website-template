# Upload Site Files to S3

In the previous module, you created your S3 bucket. Now it's time to upload your site files. In this module you will create the resource block for creating objects for your S3 Bucket. Let's get started!

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706652183018/90bcca68-f35e-4875-9058-b2f9d102dbe9.jpeg align="center")

---

[Terraform S3 Bucket Object Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_object)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706630104507/50406a81-fcef-4b02-8776-8ff3007d6779.png align="center")

I have included a basic template from [HTML5 UP!](https://html5up.net/) to utilize for the exercises.

---

## Create a new branch in GitHub

* Login to GitHub
    
* Select the **Issues** tab &gt; Select **New Issue**
    
* Add the a title, e.g. **Upload S3 bucket files**
    
* Select **Submit new issue**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706632470798/3b8da002-40c0-4697-80cf-5366538035c3.png align="center")

* On the right pane, under Development, Select **Create a branch**
    
* Leave the defaults &gt; Select **Create branch**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706632501895/5c91f218-a405-4628-9b73-084650107d83.png align="center")

* Open your IDE Terminal.
    
* Input the following:
    

```plaintext
git fetch origin
```

```plaintext
git checkout YOUR_BRANCH_NAME
```

---

## Modifying s3\_object files

In this section you will be modifying the main, variables and outputs Terraform files located in `./infra/modules/aws/s3/s3_object/`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706633103672/a39269f4-e69e-466a-9c5b-8eebe885ad99.png align="center")

### main.tf

* To create an S3 Object, modify your `./infra/modules/aws/s3/s3_object/main.tf`
    
    * Input the following:
        
        ```plaintext
        resource "aws_s3_object" "object" {
          bucket       = var.bucket_name
          key          = var.key
          source       = var.file_source
          content_type = var.content_type
          etag         = var.etag
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706633498217/e4f34ea4-ac20-4b47-80e4-abeddad7b830.png align="center")
        
        > The only required fields for creating an S3 Object are the `bucket` and `key` arguments. However, here you will define the source (where the file is located), content\_type (what kind of file it is), and etag (triggers updates when the file is modified).
        
* Save the file
    

### variables.tf

* Now we have to define the variable types for each of the arguments.
    
    * Input the following:
        
        ```plaintext
        variable "bucket_name" {
          description = "The name of the S3 bucket"
          type = string
        }
        
        variable "content_type" {
          description = "(Optional) Standard MIME type describing the format of the object data, e.g., application/octet-stream. All Valid MIME Types are valid for this input."
          type = string
          default = "text/html"
        }
        
        variable "etag" {
          description = "(Optional) Triggers updates when the value changes. The only meaningful value is filemd5(\"path/to/file\") (Terraform 0.11.12 or later) or $${md5(file(\"path/to/file\"))} (Terraform 0.11.11 or earlier). This attribute is not compatible with KMS encryption, kms_key_id or server_side_encryption = \"aws:kms\", also if an object is larger than 16 MB, the AWS Management Console will upload or copy that object as a Multipart Upload, and therefore the ETag will not be an MD5 digest (see source_hash instead)."
          type = string
          nullable = true
        }
        
        variable "file_source" {
          description = "(Optional, conflicts with content and content_base64) Path to a file that will be read and uploaded as raw bytes for the object content."
          type = string
          nullable = true
        }
        
        variable "key" {
          description = "(Required) Name of the object once it is in the bucket."
          type = string
          nullable = false
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706656244210/ef60a73c-a6a7-4973-8ac7-3aadd978fbec.png align="center")
        
    
    > Each of the values are strings. The nullable argument specifies is the value can be null. The default value for content\_type will be text/html if there is no variable passed to the argument.
    
* Save the file
    

### outputs.tf

* Here are some useful outputs if you decide you required validations for your files.
    
    * Input the following:
        
        ```plaintext
        output "etag" {
          description = "ETag generated for the object (an MD5 sum of the object content). For plaintext objects or objects encrypted with an AWS-managed key, the hash is an MD5 digest of the object data. For objects encrypted with a KMS key or objects created by either the Multipart Upload or Part Copy operation, the hash is not an MD5 digest, regardless of the method of encryption. More information on possible values can be found on Common Response Headers."
          value = aws_s3_object.object.etag
        }
        
        output "id" {
          description = "key of the resource supplied above"
          value = aws_s3_object.object.id
        }
        
        output "tags_all" {
          description = "Map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
          value = aws_s3_object.object.tags_all
        }
        
        output "version_id" {
          description = "Unique version ID value for the object, if bucket versioning is enabled."
          value = aws_s3_object.object.version_id
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706659111884/b07fc1ff-94f9-41ed-99a7-e0e6f3406f5c.png align="center")
        
* Save the file
    

---

## Modifying my\_portfolio files

In this section, you will modify the terraform files within `./infra/modules/my_portfolio`.

### main.tf

* Here you will define a locals block, and two separate module blocks
    
    * Input the following:
        
        ```plaintext
        locals {
          mime_types = jsondecode(file("${path.module}/mime.json"))
        }
        
        module "upload_assets" {
          source = "../aws/s3/s3_object"
        
          for_each     = fileset("${var.file_path}/asset_files", "**")
          bucket_name  = module.static_website.bucket_id
          key          = "/${each.key}"
          file_source  = "${var.file_path}/asset_files/${each.value}"
          content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), "text/html")
          etag         = filemd5("${var.file_path}/asset_files/${each.key}")
        }
        
        module "upload_html" {
          source = "../aws/s3/s3_object"
        
          for_each     = fileset("${var.file_path}/html_files", "**")
          bucket_name  = module.static_website.bucket_id
          key          = "/${each.key}"
          file_source  = "${var.file_path}/html_files/${each.value}"
          etag         = filemd5("${var.file_path}/html_files/${each.key}")
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706659533554/d18a5444-dcd3-404d-84eb-eda4f1309cdd.png align="center")
        
        > The locals variable references the mime.json file within my\_portfolio folder. This file contains key:value pairs for common Content-Types. The jsonencode function provides JSON syntax that can be used to pull the string values for each key.
        > 
        > The for\_each block will iterate through the given file paths, ${var.file\_path}/asset\_files and ${var.file\_path}/html\_files, using the fileset "\*\*" pattern. It will set each file, including subfolders, placing them into the root of the S3 Bucket.
        > 
        > The two module block approach is due to a couple of html files that do not have the `.html` extension. This is to have a cleaner appearing site.
        > 
        > ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706661271927/e2ebdd26-e436-4ec6-984e-aafdb4ee2463.png align="center")
        > 
        > Example:  
        > https://example.com/generic.html vs. https://example.com/generic
        > 
        > Notice that the `module.upload_assets.content_type` has a regex function. Since those HTML files do not have an extension, the regex function will throw an error that they do not match the given regex pattern. The regex pattern is essentially looking for the dot extension of the file and matching the key to it's value in the mime.json.
        > 
        > The `module.upload_html` block will use the default value "text/html" provided in the s3\_object/variables.tf.
        
* Save the file
    

### variables.tf

* Update the `./infra/modules/my_portfolio/variables.tf` to include the file\_path variable.
    
    * Input the following:
        
        ```plaintext
        variable "file_path" {
          description = "Relative path for the public folder or any future folders containing S3 bucket files."
          type = string
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706661791560/8d67f450-796a-471d-8719-61064b9d5b8d.png align="center")
        
        > As the description notes, this will be the relative path from `./infra/main.tf` to the files you want. In the case of this module, we will target the public folder for var.file\_path.
        

### outputs.tf

* Below are some examples of outputs for `module.upload_html` and `module.upload_assets` :
    
    ```plaintext
    output "index_html_etag" {
      description = "ETag generated for the object (an MD5 sum of the object content). For plaintext objects or objects encrypted with an AWS-managed key, the hash is an MD5 digest of the object data. For objects encrypted with a KMS key or objects created by either the Multipart Upload or Part Copy operation, the hash is not an MD5 digest, regardless of the method of encryption. More information on possible values can be found on Common Response Headers."
      value = module.upload_html["index.html"].etag
    }
    
    output "assets_css_main_etag" {
      description = "ETag generated for the object (an MD5 sum of the object content). For plaintext objects or objects encrypted with an AWS-managed key, the hash is an MD5 digest of the object data. For objects encrypted with a KMS key or objects created by either the Multipart Upload or Part Copy operation, the hash is not an MD5 digest, regardless of the method of encryption. More information on possible values can be found on Common Response Headers."
      value = module.upload_assets["assets/css/main.css"].etag
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706687429181/4cbada14-b218-4c8b-832c-434b2d265b68.png align="center")
    
    > Each file of each module will have to be defined for their respective outputs. For brevity, I've only included two. Feel free to find the values you want and include them.
    
* Save the file
    

---

## Modifying ./infra/main.tf

### main.tf

* Modify your `./infra/main.tf`
    
    * Input the following:
        
        ```plaintext
        file_path   = "../public"
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706685472677/ec2c90eb-c1a3-44b5-ad96-a5d05f066aff.png align="center")
        

### variables.tf and outputs.tf

* Since the file\_path has been hard coded, you do not have to modify your variables.tf
    
* Optionally, you can include the outputs.tf. Based off the example above:
    

```plaintext
output "index_html_etag" {
  description = "ETag generated for the object (an MD5 sum of the object content). For plaintext objects or objects encrypted with an AWS-managed key, the hash is an MD5 digest of the object data. For objects encrypted with a KMS key or objects created by either the Multipart Upload or Part Copy operation, the hash is not an MD5 digest, regardless of the method of encryption. More information on possible values can be found on Common Response Headers."
  value = module.my_static_website.index_html_etag
}

output "main_css_etag" {
  description = "ETag generated for the object (an MD5 sum of the object content). For plaintext objects or objects encrypted with an AWS-managed key, the hash is an MD5 digest of the object data. For objects encrypted with a KMS key or objects created by either the Multipart Upload or Part Copy operation, the hash is not an MD5 digest, regardless of the method of encryption. More information on possible values can be found on Common Response Headers."
  value = module.my_static_website.assets_css_main_etag
}
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706687524900/2edb5f71-6ea4-48b0-85de-8c08cb984fef.png align="center")

> This will output those values to the Terraform Cloud outputs.

---

## Pushing to GitHub

* Ensure your files are saved.
    
* In your IDE Terminal, type the following:
    

```plaintext
git add .
```

> Add all files that were changed.

```plaintext
git commit -m "creating s3 objects from asset_files and html_files folders"
```

> Commit the changes with a comment.

```plaintext
git push
```

> Push to GitHub.

---

## Create Pull Request

* Login to GitHub.
    
* You should see the push on your repository.
    
* Select Compare and pull request.
    
* Validate the changes that were made to be pushed to `main`
    
* Select Create pull request.
    

Your Terraform Plan should run before you can merge to `main`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706687836576/2e409c62-9ac2-4afb-990e-f78d6c978c20.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706687960962/f92546d3-53b3-477e-862f-419a051acf04.png align="center")

> If you are using the same site files from the original template, the plan to add 73 should match.

* Select Merge pull request &gt; Confirm merge.
    
* Delete branch.
    
* In your IDE Terminal, type the following:
    

```plaintext
git checkout main
```

```plaintext
git pull
```

---

### Validation:

* AWS Management Console:
    
    * In the Search bar, search for "s3" &gt; Select "Buckets"
        
    * Select your Bucket, and you should see the files uploaded
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706688265327/d8e44400-76b6-4492-a208-8c3743b2765e.png align="center")

* You can validate the Content-Type by selecting any file. In this example, I have selected the generic file, which has no defined dot file extension. Scrolling to the Metadata section you will see the content type is `text/html`.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706688410591/d921c085-222d-4958-900f-eba929b6bfe7.png align="center")

---

You have completed this module and uploaded your site files to your S3 bucket. In the next module you will configure your S3 Bucket to be a static hosting website, and tie in CloudFront for content delivery.

[Next Module](./step_5.md)