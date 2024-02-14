# Creating S3 Bucket

In this module, you will create an S3 bucket that will store your web files. Later you will convert this bucket into a static-hosted website. Let's get started!

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706652139754/e155bbe6-b45e-4367-a865-a4b1643e7b5b.jpeg)

---

[Terraform S3 Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)

---

## Create a new branch in GitHub

* Login to GitHub
    
* Select the **Issues** tab &gt; Select **New Issue**
    
* Add the a title, e.g. **Create S3 Bucket**
    
* Select **Submit new issue**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706123495434/f42a9e35-5d59-4b00-8ade-f9d44115b740.png)

* On the right pane, under Development, Select **Create a branch**
    
* Leave the defaults &gt; Select **Create branch**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706123564850/a9d080b4-8199-4e5d-907b-c027ff848da9.png)

* Open your IDE Terminal.
    
* Input the following:
    

```plaintext
git fetch origin
```

```plaintext
git checkout YOUR_BRANCH_NAME
```

---

## Modifying s3 files

### main.tf

* In your IDE, you will start by modifying the `./infra/modules/aws/s3/main.tf`
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706579968607/3d909a5f-0164-4fb9-bff1-fa3a2e7a9bcb.png)
    
* Input the following to create an s3 bucket resource
    
    ```plaintext
    resource "aws_s3_bucket" "bucket" {
      bucket        = var.bucket_name
    
      tags = {
        Name        = "${var.bucket_name}"
      }
    }
    ```
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706580365913/6157a0fd-f598-4ef8-8a9c-f5981107427c.png)

> This will create a bucket with a name that will be defined at a later time. The purpose of utilizing variables is so that you can reuse this configuration file by supplying a `bucket_name`.

* Save the file
    

### variables.tf

* For `var.bucket_name` to be available for use, you have to define what the variable type is, e.g. `string, number, map, object, etc.`
    
    * Input the following:
        
        ```plaintext
        variable "bucket_name" {
          description = "Given name of the S3 bucket"
          type        = string
        }
        ```
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706580556131/6ab0107d-4f0e-4fc6-b636-19f75fbe5322.png)

> Utilizing the `variable` block you are defining the input variable for bucket\_name. The expected input will be a string value, e.g. "myveryuniquelynamedbucket".
> 
> Note: S3 Bucket names must be globally unique.

* Save the file
    

### outputs.tf

* The `outputs.tf` is utilized for return variables. You can use these as references for other modules to utilize. These can also be return values to the terminal.
    
* Input the following for the S3 Bucket return values
    
    ```plaintext
    output "id" {
      description = "Name of the bucket."
      value = aws_s3_bucket.bucket.id
    }
    
    output "arn" {
      description = "ARN of the bucket. Will be of format arn:aws:s3:::bucketname"
      value = aws_s3_bucket.bucket.arn
    }
    
    output "bucket_domain_name" {
      description = "Bucket domain name. Will be of format bucketname.s3.amazonaws.com."
      value = aws_s3_bucket.bucket.bucket_domain_name
    }
    
    output "bucket_regional_domain_name" {
      description = "Regional Domain Name for S3 Bucket"
      value = aws_s3_bucket.bucket.bucket_regional_domain_name
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706581296220/0b11c7fc-1e4e-48fa-b3c2-c4cf18b19507.png)
    
    > Referencing the Terraform S3 reference, these are the valid outputs available for the S3 Bucket.
    
    * Save the file
        

At this point you have almost all you need to create an S3 Bucket. You would just have to define what the `bucket_name` is. However, in the next few sections I will be walking you through creating additional modules so that in the event you wanted to create another static s3 bucket website, or if you wanted to build a replica of the original architecture, you can utilize that same module by defining different input variables. Essentially future proofing so that you do not have rewrite the code to tie these resources together all over again.

---

## Modifying s3\_cloudfront\_site files

In this section, you will prepare the S3 static website module. This will be the main module for creating the static hosting website configuration.

You will start with the `main.tf` in `./infra/modules/s3_cloudfront_site`. This module will reference the `./infra/modules/aws/s3/main.tf` resource.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706584709698/6c90d3e1-1ea5-47f6-b96f-ca07a8f249df.png)

### main.tf

* In the `./infra/modules/s3_cloudfront_site/main.tf`, input the following:
    
    ```plaintext
    module "bucket" {
      source = "../aws/s3"
    
      bucket_name = var.bucket_name
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706583144843/a44658b1-8532-42f3-8cfb-734f54723031.png)
    

> The module block references the child module in ../aws/s3. This is the relative path to the current `main.tf` you are configuring.
> 
> `bucket_name =` comes from the `var.bucket_name` in the `s3/main.tf.`  
> For consistency, you'll pass `var.bucket_name` from this module to the `s3/main.tf's var.bucket_name`**. This way there is no confusion on where that variable is going.**

* Save the file
    

### variables.tf

* Much like the `variables.tf` in the s3 folder, you will have to define what the input variable type is for `var.bucket_name`.
    
    * In your `./infra/modules/s3_cloudfront_site/variables.tf`, input the following:
        
        ```plaintext
        variable "bucket_name" {
          description = "Given name of the S3 bucket"
          type        = string
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706583309852/7da8bbef-d96e-4e6e-92e0-f410c38a01d2.png)
        
* Save the file
    

### outputs.tf

* Define the outputs for this module. Here, you will define the S3 Bucket resource's outputs from this module.
    
    * In your `./infra/modules/s3_cloudfront_site/outputs.tf`, input the following:
        
        ```plaintext
        output "bucket_id" {
          description = "Name of the bucket."
          value = module.bucket.id
        }
        
        output "bucket_arn" {
          description = "ARN of the bucket. Will be of format arn:aws:s3:::bucketname"
          value = module.bucket.arn
        }
        
        output "bucket_domain_name" {
          description = "Bucket domain name. Will be of format bucketname.s3.amazonaws.com."
          value = module.bucket.bucket_domain_name
        }
        
        output "bucket_regional_domain_name" {
          description = "Regional Domain Name for S3 Bucket"
          value = module.bucket.bucket_regional_domain_name
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706584350177/5154b08c-8621-499d-8de0-356d04f63426.png)
        

> The output variable names are different here because in the future, there will be other resources that have `id` and `arn` values as well. To distinguish between where the value comes from it's good to give a unique identifier where the output is coming from.
> 
> Note the values for the output variables. They reference the module in the main.tf.

* Save the file
    

---

## Modifying my\_portfolio files

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706584764642/c9a52e7f-2067-4647-adf1-0a231f28a454.png)

### main.tf

Similar to the s3\_cloud\_site module, you will modify the main, variables and outputs Terraform files. The my\_portfolio module will be the main module to reference when tying all the associated services together, e.g. S3, CloudFront, DynamoDB, SNS, etc.

This module will reference the s3\_cloudfront\_site module to create the S3 bucket, and then later to create the CloudFront distribution.

* In the `./infra/modules/my_portfolio/main.tf`, input the following:
    
    ```plaintext
    module "static_website" {
      source = "../s3_cloudfront_site"
    
      bucket_name       = var.bucket_name
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706584848744/c2e62e9b-1ec8-4560-8304-a62e433fc9b5.png)
    

> Similar to the other main.tf files, you are passing the variable bucket name, and referencing the s3\_cloudfront\_site module.

* Save the file
    

### variables.tf

* In your `./infra/modules/my_portfolio/variables.tf`, input the following:
    
    ```plaintext
    variable "bucket_name" {
      description = "Given name of the S3 bucket"
      type        = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706584896358/6e5a0e13-b3ee-4208-acc0-4a22b428d207.png)
    
    * Save the file
        

### outputs.tf

In your `./infra/modules/my_portfolio/outputs.tf`, input the following:

```plaintext
output "bucket_id" {
  description = "Name of the bucket."
  value = module.static_website.bucket_id
}

output "bucket_arn" {
  description = "ARN of the bucket. Will be of format arn:aws:s3:::bucketname"
  value = module.static_website.bucket_arn
}

output "bucket_domain_name" {
  description = "Bucket domain name. Will be of format bucketname.s3.amazonaws.com."
  value = module.static_website.bucket_domain_name
}

output "bucket_regional_domain_name" {
  description = "Regional Domain Name for S3 Bucket"
  value = module.static_website.bucket_regional_domain_name
}
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706585326577/56453cc5-2ff5-40e2-8f30-0fd835d3121c.png)

* Save the file
    

---

## Modifying /infra/main.tf

`./infra/main.tf` will be the module where all variables will be defined. This module will reference the my\_portfolio module.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706585547502/91dd9338-19b9-4cd1-a56a-164a8fa9df89.png)

### main.tf

* In your `./infra/main.tf`, input the following:
    
    ```plaintext
    module "my_static_website" {
      source = "./modules/my_portfolio"
    
      bucket_name = "Your_Unique_Bucket_Name"
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706585577652/fc3a011e-8657-42c4-956e-52e67a30c4d4.png)
    
    * Save the file
        

Since bucket\_name is hard coded, you do not have to modify the `variables.tf`

### outputs.tf

* If you would like to see the values for your resource output in the Terraform Cloud outputs, include the following:
    
    ```plaintext
    output "bucket_id" {
      description = "Name of the bucket."
      value = module.my_static_website.bucket_id
    }
    
    output "bucket_arn" {
      description = "ARN of the bucket. Will be of format arn:aws:s3:::bucketname"
      value = module.my_static_website.arn
    }
    
    output "bucket_domain_name" {
      description = "Bucket domain name. Will be of format bucketname.s3.amazonaws.com."
      value = module.my_static_website.bucket_domain_name
    }
    
    output "bucket_regional_domain_name" {
      description = "Regional Domain Name for S3 Bucket"
      value = module.my_static_website.bucket_regional_domain_name
    }
    ```
    

I'm not too concerned about receiving these outputs, so I will not include it in my configuration. The only required output for CloudFront Invalidation will be the CloudFront ID.

---

## Modifying .yml files

* Modify your `terraform-plan.yml` and `terraform-apply_cloudfront-invalidation.yml`
    
* Uncomment the `on:` arguments in each
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706586311895/28b70a1f-debf-4d05-b493-aff009fd0a9a.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706586333438/4daeb94b-a32d-4e4a-8087-81dc878d397a.png)

---

## Pushing to GitHub

* Ensure your files are saved.
    
* In your IDE Terminal, type the following:
    

```plaintext
git add .
```

> Add all files that were changed.

```plaintext

git commit -m "modified modules to create S3 bucket"
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

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706586627898/55a5693e-feff-4d66-863e-fb186860e341.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706587216370/83ca847d-10e3-43b6-8bd2-5434d94e687a.png)

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

* There are 2 ways for validation:
    
* AWS CLI:
    
    ```plaintext
    aws s3 ls
    michaelmaratita-static-website-tutorial
    ```
    
* AWS Management Console:
    
    * In the Search bar, search for "s3" &gt; Select "Buckets"
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706587380370/338f9522-7436-4042-bf06-47dd9595d0bf.png)

---

You have completed this section on creating an S3 bucket. In the next module, you will upload your site files to your S3 bucket.

[Next Module](./step_4.md)