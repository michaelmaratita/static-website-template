# Creating CloudFront Distribution

In this module you will create an S3 static hosted website that will be accessible through a CloudFront Distribution. By doing this, you will block all direct public access to your S3 objects, and they will only be available through the content delivery network. This will also provide an HTTPS connection, instead of the static website hosting URL that is HTTP. You will create a bucket policy so that CloudFront will have access to "GetObject" from the S3 Bucket. Let's get started!

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706714158216/e67753cd-1812-4aa1-a043-be39c96e39c8.jpeg align="center")

---

[Terraform S3 Bucket Policy Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy)

[Terraform S3 Website Configuration Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_website_configuration)

[Terraform CloudFront Distribution Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution)

[Terraform CloudFront Origin Access Control](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_origin_access_control)

---

## Create a new branch in GitHub

* Login to GitHub
    
* Select the **Issues** tab &gt; Select **New Issue**
    
* Add the a title, e.g. **Create static website**
    
* Select **Submit new issue**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706715508854/e98765ef-af3c-4391-82ad-404bb9c3e3d5.png align="center")

* On the right pane, under Development, Select **Create a branch**
    
* Leave the defaults &gt; Select **Create branch**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706715531085/ed8dc3b4-f542-4b5b-a5af-a0a399c40f19.png align="center")

* Open your IDE Terminal.
    
* Input the following:
    

```plaintext
git fetch origin
```

```plaintext
git checkout YOUR_BRANCH_NAME
```

---

## Current Bucket State

Note the start of your current bucket, should be like below.

* To view this, select your **Bucket** &gt; select **Properties**
    
    * Scroll to the bottom and see **Static website hosting**
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706714642492/3d22d144-cf77-4c7e-bb85-f0ce8830286a.png align="center")

---

## Modifying s3\_website\_configuration

* To get started you will be modifying the main, variables and outputs Terraform files located in `./infra/modules/aws/s3/s3_website_configuration/`.
    

### main.tf

* To create the configuration for the **Static website hosting** for your S3 Bucket, input the following:
    
    ```plaintext
    resource "aws_s3_bucket_website_configuration" "website_configuration" {
      bucket   = var.bucket_name
    
      index_document {
        suffix = "index.html"
      }
    }
    ```
    
    > This will create the website configuration on the bucket defined as bucket\_name.
    
* Next you will add a bucket policy so that CloudFront will have access to the S3 Bucket.
    
    * Input the following:
        
        ```plaintext
        data "aws_iam_policy_document" "bucket_policy" {
          statement {
            sid = var.sid
            effect = "Allow"
        
            principals {
              type = "Service"
              identifiers = ["cloudfront.amazonaws.com"]
            }
        
            actions = [
              "s3:GetObject"
            ]
            
            resources = var.resource
        
            condition {
              test = "StringEquals"
              variable = "AWS:SourceArn"
              values = [ var.cloudfront_distribution_arn ]
            }
          }
        }
        
        resource "aws_s3_bucket_policy" "bucket_policy" {
          bucket = var.bucket_name
          policy = data.aws_iam_policy_document.bucket_policy.json
        }
        ```
        
        > data.aws\_iam\_policy document creates a template of an IAM policy to allow the CloudFront service the ability to "GetObject" from the S3 bucket. You further define a condition for what Distribution will have the allow access to your defined bucket. The ARN for the CloudFront distribution will be an output variable from the CloudFront distribution module.
        > 
        > The policy is then attached as a bucket policy to the bucket you created.
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707369187303/fc230a84-74b8-4eec-a7c3-3b18e398262a.png align="center")
        
* Save the file
    

### variables.tf

* Input the following to define the variables for the S3 Bucket website configuration:
    
    ```plaintext
    variable "bucket_name" {
      description = "The name of the S3 bucket"
      type = string
    }
    
    variable "sid" {
      description = "statement ID for Policy"
      type = string
    }
    
    variable "cloudfront_distribution_arn" {
      description = "ARN for CloudFront distribution"
      type = string
    }
    
    variable "resource" {
      description = "(Required in only some circumstances) – If you create an IAM permissions policy, you must specify a list of resources to which the actions apply. If you create a resource-based policy, this element is optional. If you do not include this element, then the resource to which the action applies is the resource to which the policy is attached."
      type = list(string)
    }
    ```
    
* Save the file
    

> Note: Defining output variables is optional here since you will not require any of them as inputs for other modules. Refer to the references above for the available outputs.

---

## Modifying cloudfront\_distribution

* In this section, you will modify the terraform files located in `./infa/moudles/aws/cloudfront_distrution`
    

### main.tf

* Input the following to create the CloudFront Distribution resource block
    
    ```plaintext
    resource "aws_cloudfront_distribution" "s3_distribution" {
      origin {
        domain_name              = var.bucket_regional_domain_name
        origin_access_control_id = aws_cloudfront_origin_access_control.default.id
        origin_id                = var.origin_id
      }
    
      enabled             = true
      is_ipv6_enabled     = true
      comment             = var.comment
      default_root_object = var.default_root_object
    
      default_cache_behavior {
        allowed_methods  = var.allowed_methods
        cached_methods   = var.cached_methods
        target_origin_id = var.origin_id
    
        forwarded_values {
          query_string = var.query_string
    
          cookies {
            forward = var.cookies_forward
          }
        }
    
        viewer_protocol_policy = var.viewer_protocol_policy
        min_ttl                = var.min_ttl
        default_ttl            = var.default_ttl
        max_ttl                = var.max_ttl
      }
    
      price_class = var.price_class
    
      restrictions {
        geo_restriction {
          restriction_type = var.restriction_type
          locations        = var.locations
        }
      }
    
      viewer_certificate {
        cloudfront_default_certificate = true
      }
    }
    ```
    
    > Later in the variables section you will define the majority of these variables with default values.
    > 
    > In order for the CloudFront distribution to be accessible, you will need to create an Origin Access Control for the S3 bucket website configuration resource.
    
* Input the following to define the Origin Access Control
    
    ```plaintext
    resource "aws_cloudfront_origin_access_control" "default" {
      name                              = var.name
      description                       = var.description
      origin_access_control_origin_type = var.origin_access_control_origin_type
      signing_behavior                  = var.signing_behavior
      signing_protocol                  = var.signing_protocol
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707374483990/30df6d6d-a234-4245-84b0-6c0b661b2254.png align="center")
    
* Save the file
    

### variables.tf

* Input the following to define each of the variables and some with their default values.
    
    ```plaintext
    # aws_cloudfront_origin_access_contol.default
    variable "name" {
      description = "(Required) A name that identifies the Origin Access Control."
      type = string
    }
    
    variable "description" {
      description = "(Optional) The description of the Origin Access Control. Defaults to \"Managed by Terraform\" if omitted."
      type = string
    }
    
    variable "origin_access_control_origin_type" {
      description = "(Required) The type of origin that this Origin Access Control is for. Valid values are s3, and mediastore."
      type = string
      default = "s3"
    }
    
    variable "signing_behavior" {
      description = "(Required) Specifies which requests CloudFront signs. Specify always for the most common use case. Allowed values: always, never, and no-override."
      type = string
      default = "always"
    }
    
    variable "signing_protocol" {
      description = "Required) Determines how CloudFront signs (authenticates) requests. The only valid value is sigv4."
      type = string
      default = "sigv4"
    }
    
    # aws_cloudfront_distribution.s3_distribution
    variable "comment" {
      description = "(Optional) - Any comments you want to include about the distribution."
      type = string
    }
    
    variable "bucket_regional_domain_name" {
      description = "Regional Domain Name for S3 Bucket"
      type = string
    }
    
    variable "default_root_object" {
      description = "(Optional) - Object that you want CloudFront to return (for example, index.html) when an end user requests the root URL."
      type = string
      default = "index.html"
    }
    
    variable "allowed_methods" {
      description = "(Required) - Controls which HTTP methods CloudFront processes and forwards to your Amazon S3 bucket or your custom origin."
      type = list(string)
      default = [ "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT" ]
    }
    
    variable "cached_methods" {
      description = "(Required) - Controls whether CloudFront caches the response to requests using the specified HTTP methods."
      type = list(string)
      default = [ "GET", "HEAD" ]
    }
    
    variable "origin_id" {
      description = "Origin Access Control ID Value"
      type = string
    }
    
    variable "query_string" {
      description = "(Required) - Indicates whether you want CloudFront to forward query strings to the origin that is associated with this cache behavior."
      type = bool
      default = false
    }
    
    variable "cookies_forward" {
      description = "(Required) - The forwarded values cookies that specify how CloudFront handles cookies (maximum one)."
      type = string
      default = "none"
    }
    
    variable "viewer_protocol_policy" {
      description = "(Required) - Use this element to specify the protocol that users can use to access the files in the origin specified by TargetOriginId when a request matches the path pattern in PathPattern. One of allow-all, https-only, or redirect-to-https."
      type = string
      default = "redirect-to-https"
    }
    
    variable "min_ttl" {
      description = "(Optional) - Minimum amount of time that you want objects to stay in CloudFront caches before CloudFront queries your origin to see whether the object has been updated. Defaults to 0 seconds."
      type = number
      default = 0
    }
    
    variable "default_ttl" {
      description = "(Optional) - Default amount of time (in seconds) that an object is in a CloudFront cache before CloudFront forwards another request in the absence of an Cache-Control max-age or Expires header."
      type = number
      default = 3600
    }
    
    variable "max_ttl" {
      description = "(Optional) - Maximum amount of time (in seconds) that an object is in a CloudFront cache before CloudFront forwards another request to your origin to determine whether the object has been updated. Only effective in the presence of Cache-Control max-age, Cache-Control s-maxage, and Expires headers."
      type = number
      default = 84600
    }
    
    variable "price_class" {
      description = "(Optional) - Price class for this distribution. One of PriceClass_All, PriceClass_200, PriceClass_100."
      type = string
      default = "PriceClass_200"
    }
    
    variable "restriction_type" {
      description = "(Required) - Method that you want to use to restrict distribution of your content by country: none, whitelist, or blacklist"
      type = string
      default = "none"
    }
    
    variable "locations" {
      description = "(Required) - ISO 3166-1-alpha-2 codes for which you want CloudFront either to distribute your content (whitelist) or not distribute your content (blacklist). If the type is specified as none an empty array can be used."
      type = list(string)
      default = []
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707372360304/0d979d2e-820f-4138-961f-f319a2c6d6ac.png align="center")
    
    * Save the file
        

### outputs.tf

* Input the following to define the output variables for your CloudFront distribution resource
    
    ```plaintext
    output "id" {
      description = "Identifier for the distribution. For example: EDFDVBD632BHDS5."
      value = aws_cloudfront_distribution.s3_distribution.id
    }
    
    output "arn" {
      description = "ARN for the distribution. For example: arn:aws:cloudfront::123456789012:distribution/EDFDVBD632BHDS5, where 123456789012 is your AWS account ID"
      value = aws_cloudfront_distribution.s3_distribution.arn
    }
    
    output "caller_reference" {
      description = "Internal value used by CloudFront to allow future updates to the distribution configuration."
      value = aws_cloudfront_distribution.s3_distribution.caller_reference
    }
    
    output "status" {
      description = "Current status of the distribution. Deployed if the distribution's information is fully propagated throughout the Amazon CloudFront system."
      value = aws_cloudfront_distribution.s3_distribution.status
    }
    
    output "tags_all" {
      description = "Map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
      value = aws_cloudfront_distribution.s3_distribution.tags_all
    }
    
    output "trusted_key_groups" {
      description = "List of nested attributes for active trusted key groups, if the distribution is set up to serve private content with signed URLs."
      value = aws_cloudfront_distribution.s3_distribution.trusted_key_groups
    }
    
    output "trusted_signers" {
      description = "List of nested attributes for active trusted signers, if the distribution is set up to serve private content with signed URLs."
      value = aws_cloudfront_distribution.s3_distribution.trusted_signers
    }
    
    output "domain_name" {
      description = "Domain name corresponding to the distribution. For example: d604721fxaaqy9.cloudfront.net"
      value = aws_cloudfront_distribution.s3_distribution.domain_name
    }
    
    output "last_modified_time" {
      description = "Date and time the distribution was last modified."
      value = aws_cloudfront_distribution.s3_distribution.last_modified_time
    }
    
    output "in_progress_validation_batches" {
      description = "Number of invalidation batches currently in progress."
      value = aws_cloudfront_distribution.s3_distribution.in_progress_validation_batches
    }
    
    output "etag" {
      description = "Current version of the distribution's information. For example: E2QWRUHAPOMQZL."
      value = aws_cloudfront_distribution.s3_distribution.etag
    }
    
    output "hosted_zone_id" {
      description = "CloudFront Route 53 zone ID that can be used to route an Alias Resource Record Set to. This attribute is simply an alias for the zone ID Z2FDTNDATAQYW2."
      value = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707370992979/1c821cc5-4dc9-4ed8-bd1a-f8042a586591.png align="center")
    
    * Save the file
        
    
    ---
    
    ## Updating s3\_cloudfront\_site
    
* In this section you will complete the s3\_cloudfront\_site module so it can be used in the my\_portfolio module. You will include module blocks from the s3\_website\_configuration and the cloudfront\_distribution.
    

### main.tf

* Input the following to update your current configuration.
    
    ```plaintext
    module "s3_website_config" {
      source = "../aws/s3/s3_website_configuration"
    
      sid                         = var.bucket_policy_sid
      bucket_name                 = module.bucket.id
      cloudfront_distribution_arn = module.cloudfront_distribution.arn
      resource                    = ["${module.bucket.arn}/*"]
    }
    ```
    
    > Module block for the S3 Bucket website configuration
    
    ```plaintext
    module "cloudfront_distribution" {
      source = "../aws/cloudfront_distribution"
    
      name                        = var.name
      description                 = var.description
      comment                     = var.comment
      bucket_regional_domain_name = module.bucket.bucket_regional_domain_name
      origin_id                   = var.origin_id
    }
    ```
    
    > Module block for CloudFront Distribution
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707378928842/e05c75bf-1fd3-4ae2-ae8e-ea413973238a.png align="center")

* Save the file
    

### variables.tf

* Input the following to update the input variables for s3\_cloudfront\_site:
    
    ```plaintext
    variable "bucket_name" {
      description = "Given name of the S3 bucket"
      type = string
    }
    
    variable "name" {
      description = "Name for Origin Access Control"
      type = string
    }
    
    variable "description" {
      description = "Description for Origin Access Control"
      type = string
    }
    
    variable "comment" {
      description = "Comment for CloudFront Distribution"
      type = string
    }
    
    variable "origin_id" {
      description = "ID for Origin Access Control"
      type = string
    }
    
    variable "bucket_policy_sid" {
      description = "Sid for Bucket Policy"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707374402535/43f1f572-22a8-470d-a684-9d534d44c770.png align="center")
    

### outputs.tf

* Input the following to update your output variables for this module:
    
    ```plaintext
    output "cloudfront_id" {
      description = "Identifier for the distribution. For example: EDFDVBD632BHDS5."
      value = module.cloudfront_distribution.id
    }
    
    output "cloudfront_arn" {
      description = "ARN for the distribution. For example: arn:aws:cloudfront::123456789012:distribution/EDFDVBD632BHDS5, where 123456789012 is your AWS account ID"
      value = module.cloudfront_distribution.arn
    }
    
    output "cloudfront_caller_reference" {
      description = "Internal value used by CloudFront to allow future updates to the distribution configuration."
      value = module.cloudfront_distribution.caller_reference
    }
    
    output "cloudfront_status" {
      description = "Current status of the distribution. Deployed if the distribution's information is fully propagated throughout the Amazon CloudFront system."
      value = module.cloudfront_distribution.status
    }
    
    output "cloudfront_tags_all" {
      description = "Map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
      value = module.cloudfront_distribution.tags_all
    }
    
    output "cloudfront_trusted_key_groups" {
      description = "List of nested attributes for active trusted key groups, if the distribution is set up to serve private content with signed URLs."
      value = module.cloudfront_distribution.trusted_key_groups
    }
    
    output "cloudfront_trusted_signers" {
      description = "List of nested attributes for active trusted signers, if the distribution is set up to serve private content with signed URLs."
      value = module.cloudfront_distribution.trusted_signers
    }
    
    output "cloudfront_domain_name" {
      description = "Domain name corresponding to the distribution. For example: d604721fxaaqy9.cloudfront.net"
      value = module.cloudfront_distribution.domain_name
    }
    
    output "cloudfront_last_modified_time" {
      description = "Date and time the distribution was last modified."
      value = module.cloudfront_distribution.last_modified_time
    }
    
    output "cloudfront_in_progress_validation_batches" {
      description = "Number of invalidation batches currently in progress."
      value = module.cloudfront_distribution.in_progress_validation_batches
    }
    
    output "cloudfront_etag" {
      description = "Current version of the distribution's information. For example: E2QWRUHAPOMQZL."
      value = module.cloudfront_distribution.etag
    }
    
    output "cloudfront_hosted_zone_id" {
      description = "CloudFront Route 53 zone ID that can be used to route an Alias Resource Record Set to. This attribute is simply an alias for the zone ID Z2FDTNDATAQYW2."
      value = module.cloudfront_distribution.hosted_zone_id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707494899335/a84b7308-b22b-4120-bc59-197dc89f0f0b.png align="center")
    
* Save the file
    

---

## Modifying my\_portfolio

* In this section, you will update my\_portfolio
    

### main.tf

* Input the following to update the `module.static_website` block:
    
    ```plaintext
      name              = var.origin_access_name
      description       = var.origin_access_description
      comment           = var.cloudfront_comment
      origin_id         = var.origin_id
      bucket_policy_sid = var.bucket_policy_sid
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707373958063/822f6691-95f0-41fe-b4ff-e7b03fd19177.png align="center")
    
* Save the file
    

### variables.tf

* Input the following to update your variables.tf
    
    ```plaintext
    variable "origin_access_name" {
      description = "Name for Origin Access Control"
      type = string
    }
    
    variable "origin_access_description" {
      description = "Description for Origin Access Control"
      type = string
    }
    
    variable "cloudfront_comment" {
      description = "Comment for CloudFront Distribution"
      type = string
    }
    
    variable "origin_id" {
      description = "ID for Origin Access Control"
      type = string
    }
    
    variable "bucket_policy_sid" {
      description = "Sid for Bucket Policy"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707374208293/aa288357-4f9d-42da-ab4f-247238efb140.png align="center")
    
    * Save the file
        

### outputs.tf

* Input the following to update your output variables for this module:
    
    ```plaintext
    output "cloudfront_id" {
      description = "Identifier for the distribution. For example: EDFDVBD632BHDS5."
      value = module.static_website.cloudfront_id
    }
    
    output "cloudfront_arn" {
      description = "ARN for the distribution. For example: arn:aws:cloudfront::123456789012:distribution/EDFDVBD632BHDS5, where 123456789012 is your AWS account ID"
      value = module.static_website.cloudfront_arn
    }
    
    output "cloudfront_caller_reference" {
      description = "Internal value used by CloudFront to allow future updates to the distribution configuration."
      value = module.static_website.cloudfront_caller_reference
    }
    
    output "cloudfront_status" {
      description = "Current status of the distribution. Deployed if the distribution's information is fully propagated throughout the Amazon CloudFront system."
      value = module.static_website.cloudfront_status
    }
    
    output "cloudfront_tags_all" {
      description = "Map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
      value = module.static_website.cloudfront_tags_all
    }
    
    output "cloudfront_trusted_key_groups" {
      description = "List of nested attributes for active trusted key groups, if the distribution is set up to serve private content with signed URLs."
      value = module.static_website.cloudfront_trusted_key_groups
    }
    
    output "cloudfront_trusted_signers" {
      description = "List of nested attributes for active trusted signers, if the distribution is set up to serve private content with signed URLs."
      value = module.static_website.cloudfront_trusted_signers
    }
    
    output "cloudfront_domain_name" {
      description = "Domain name corresponding to the distribution. For example: d604721fxaaqy9.cloudfront.net"
      value = module.static_website.cloudfront_domain_name
    }
    
    output "cloudfront_last_modified_time" {
      description = "Date and time the distribution was last modified."
      value = module.static_website.cloudfront_last_modified_time
    }
    
    output "cloudfront_in_progress_validation_batches" {
      description = "Number of invalidation batches currently in progress."
      value = module.static_website.cloudfront_in_progress_validation_batches
    }
    
    output "cloudfront_etag" {
      description = "Current version of the distribution's information. For example: E2QWRUHAPOMQZL."
      value = module.static_website.cloudfront_etag
    }
    
    output "cloudfront_hosted_zone_id" {
      description = "CloudFront Route 53 zone ID that can be used to route an Alias Resource Record Set to. This attribute is simply an alias for the zone ID Z2FDTNDATAQYW2."
      value = module.static_website.cloudfront_hosted_zone_id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707495040088/080c4a47-d922-4cf7-acbb-6a2048435860.png align="center")
    
* Save the file
    

---

## Modifying ./infra/main.tf

* In this section, you will define the input variables for your `module.my_static_website`
    
* Input the following:
    
    ```plaintext
      bucket_policy_sid = "AllowCloudFrontServicePrincipalReadOnly"
      origin_id = "my_origin_access_id"
      origin_access_name = "Origin Access Cotrol for Bucket Website"
      origin_access_description = "Original Access Controls for Static Website Hosting"
      cloudfront_comment = "Static website hosting for my personal website."
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707378328780/db374a0f-1071-4956-a15b-3701fc7473df.png align="center")
    
* Save the file
    

### outputs.tf

* There is only one output that you will require to complete CloudFront invalidations:
    
    * Input the following:
        
        ```plaintext
        output "cloudfront_id" {
          description = "Identifier for the distribution. For example: EDFDVBD632BHDS5."
          value = module.my_static_website.cloudfront_id
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707495205981/96a7651c-2a48-4482-8443-1eafd562447a.png align="center")
        
* Save the file
    

---

## Pushing to GitHub

* Ensure your files are saved.
    
* In your IDE Terminal, type the following:
    

```plaintext
git add .
```

> Add all files that were changed.

```plaintext
git commit -m "create cloudfront distribution for static website"
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

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707378711398/7e8337b2-c8d0-4690-b34a-ebbfd467dbe7.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707379105518/e1f4614b-fddb-43e9-b70f-280dc2708b2d.png align="center")

> If you are using the same site files from the original template, the plan to add 4 should match.

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
    
    * In the Search bar, search for "s3" &gt; Select your bucket
        
    * Notice your bucket state under properties:
        
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707412758101/41afd7dc-38c6-4730-af33-ce50b5d2847c.png align="center")
    
    > Note this URL will not be accessible directly due to the bucket policy restrictions from public access.
    
    * In the Search bar, search for "cloudfront" &gt; Select "Distributions"
        
    * Locate your distribution and note the Domain name. This will be how you access your site.
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707379359892/9d1c3487-438b-4ff2-9a90-9ea683e78dea.png align="center")

* Once the CloudFront Distribution completes it's deployment, navigate to the CloudFront URL.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707379535778/c5a14b16-a91f-42dd-b0d1-501ec8548256.png align="center")

---

You have successfully created a CloudFront distribution to host your S3 bucket website. In the next module, you will create a DynamoDB table and a table item to store a visitor count for your site. This will be integrated later with API Gateway and Lambda.

[Next Module](./step_6.md)