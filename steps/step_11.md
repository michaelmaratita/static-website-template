# Configuring Amazon Certificate Manager (ACM) Certificate and Route53 Entries

In this final module, you will create an ACM certificate and Route53 entries for CloudFront and API Gateway using your custom domain name. This will present a more profession website that can be shared with others.

[![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707844951736/cd169e00-72c2-425b-bd48-5cc301d91131.jpeg)](https://cdn.hashnode.com/res/hashnode/image/upload/v1707844951736/cd169e00-72c2-425b-bd48-5cc301d91131.jpeg)

---

[Terraform ACM Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate)

[Terraform API Gateway Domain Name Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_domain_name)

[Terraform Route53 Record Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)

---

## Create a new branch in GitHub

* Login to GitHub.
    
* Select the Issues tab &gt; Select New Issue.
    
* Add the a title, e.g. **Create ACM Certificate and Route53 Entries**
    
* Select Submit new issue.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707845107781/ca758254-9611-42f4-baba-d3784eed8ae4.png)

* On the right pane, under Development, Select Create a branch.
    
* Leave the defaults &gt; Select Create branch.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707845132555/b858ab84-a319-43ac-8741-7895a2f25b6b.png)

* Open your IDE Terminal.
    
* Input the following:
    

```plaintext
git fetch origin
```

```plaintext
git checkout YOUR_BRANCH_NAME
```

---

## Modifying acm files

In this section, you will configure the creation for your Amazon Certificate Manager Certificate. Locate your acm files in `./infra/modules/aws/acm`.

### main.tf

* Input the following to create the ACM certificate
    
    ```plaintext
    provider "aws" {
      alias  = "us-east-1"
      region = "us-east-1"
    }
    
    resource "aws_acm_certificate" "cert" {
      provider                  = aws.us-east-1
      domain_name               = var.domain_name
      subject_alternative_names = var.subject_alternative_names
      validation_method         = var.validation_method
    
      tags = var.tags
    
      lifecycle {
        create_before_destroy = true
      }
    }
    
    
    resource "aws_acm_certificate_validation" "cert" {
      provider                = aws.us-east-1
      certificate_arn         = aws_acm_certificate.cert.arn
      validation_record_fqdns = var.validation_record
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707846091712/4c19ac13-d465-427a-8d15-699468713c0b.png)
    
    > The requirement for CloudFront to utilize the ACM certificate, it has to be created in the us-east-1 region. The provider block creates an alias for that region so that it can be utilized for CloudFront. The ACM Certificate Validation block automates the DNS validation for the certificate in Route53.
    
* Save the file
    

### variables.tf

* Input the following to define the input variables for the ACM module:
    
    ```plaintext
    variable "domain_name" {
      description = "The name of the custom domain associated with Route53 and CloudFront"
      type = string
    }
    
    variable "subject_alternative_names" {
      description = "(Optional) Set of domains that should be SANs in the issued certificate. To remove all elements of a previously configured list, set this value equal to an empty list ([]) or use the terraform taint command to trigger recreation."
      type = list(string)
      default = [ ]
    }
    
    variable "validation_method" {
      description = "(Optional) Which method to use for validation. DNS or EMAIL are valid. This parameter must not be set for certificates that were imported into ACM and then into Terraform."
      type = string
      default = "DNS"
    }
    
    variable "validation_record" {
      type = list(string)
    }
    
    variable "tags" {
      description = "(Optional) Map of tags to assign to the resource. If configured with a provider default_tags configuration block present, tags with matching keys will overwrite those defined at the provider-level."
      type = map(string)
      default = {
        "Enivronment" = "Production",
        "Terraform"   = true
      }
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707846623427/b1cc2ac0-8710-4ae8-b2ab-6aa695cd3142.png)
    
* Save the file
    

### outputs.tf

* Input the following to define the return values
    
    ```plaintext
    # aws_acm_certificate.cert
    
    output "id" {
      description = "ARN of the certificate"
      value = aws_acm_certificate.cert.id
    }
    
    output "arn" {
      description = "ARN of the certificate"
      value = aws_acm_certificate.cert.arn
    }
    
    output "domain_name" {
      description = "Domain name for which the certificate is issued"
      value = aws_acm_certificate.cert.domain_name
    }
    
    output "domain_validation_options" {
      description = "Set of domain validation objects which can be used to complete certificate validation. Can have more than one element, e.g., if SANs are defined. Only set if DNS-validation was used."
      value = aws_acm_certificate.cert.domain_validation_options
    }
    
    output "not_after" {
      description = "Expiration date and time of the certificate."
      value = aws_acm_certificate.cert.not_after
    }
    
    output "not_before" {
      description = "Start of the validity period of the certificate."
      value = aws_acm_certificate.cert.not_before
    }
    
    output "pending_renewal" {
      description = "true if a Private certificate eligible for managed renewal is within the early_renewal_duration period."
      value = aws_acm_certificate.cert.pending_renewal
    }
    
    output "renewal_eligibility" {
      description = "Whether the certificate is eligible for managed renewal."
      value = aws_acm_certificate.cert.renewal_eligibility
    }
    
    output "renewal_summary" {
      description = "Contains information about the status of ACM's managed renewal for the certificate."
      value = aws_acm_certificate.cert.renewal_summary
    }
    
    output "status" {
      description = "Status of the certificate."
      value = aws_acm_certificate.cert.status
    }
    
    output "validation_method" {
      description = "(Optional) Which method to use for validation. DNS or EMAIL are valid. This parameter must not be set for certificates that were imported into ACM and then into Terraform."
      value = aws_acm_certificate.cert.validation_method
    }
    
    output "type" {
      description = "Source of the certificate."
      value = aws_acm_certificate.cert.type
    }
    
    output "tags_all" {
      description = "Map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
      value = aws_acm_certificate.cert.tags_all
    }
    
    output "validation_emails" {
      description = "List of addresses that received a validation email. Only set if EMAIL validation was used."
      value = aws_acm_certificate.cert.validation_emails
    }
    
    # aws_acm_certificate_validation.cert
    
    output "validation_certificate_arn" {
      description = "Certificate ARN for Validation certificate from ACM"
      value = aws_acm_certificate_validation.cert.certificate_arn
    }
    
    output "validation_id" {
      description = "Time at which the certificate was issued"
      value = aws_acm_certificate_validation.cert.id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707846902898/939f9161-5631-454a-b4cc-665075062fd5.png)
    
* Save the file
    

---

## Modifying route53 files

* Locate your terraform files in `./infra/modules/aws/route53`.
    

You will start by creating the validation in Route53 for the ACM certificate.

* Locate your acm\_validation folder in your `./infra/modules/aws/route53` folder
    

## acm\_validation

### main.tf

* Input the following to create the validation option for your ACM certificate
    
    ```plaintext
    resource "aws_route53_record" "validation" {
      for_each = {
        for dvo in var.domain_validation_options : dvo.domain_name => {
          name   = dvo.resource_record_name
          record = dvo.resource_record_value
          type   = dvo.resource_record_type
        }
      }
    
      allow_overwrite = true
      name            = each.value.name
      records         = [each.value.record]
      ttl             = 60
      type            = each.value.type
      zone_id         = var.zone_id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707847670953/3d1e6d8a-058f-434f-b3d6-e37f00a1031f.png)
    
* Save the file
    

### variables.tf

* Input the following to create the input variables for this module
    
    ```plaintext
    variable "domain_validation_options" {
      description = "Passed value from aws_acm_certificate.cert for domain_validation_options"
      type = set(object({
          domain_name           = string
          resource_record_name  = string
          resource_record_type  = string
          resource_record_value = string
        }))
    }
    
    variable "zone_id" {
      description = "Passed value from data.aws_route53_zone.my_domain.zone_id"
      type = string
    }
    
    # Required for outputs.tf
    variable "domain_name" {
      description = "Domain name for which the certificate is issued."
      type = string
    }
    
    variable "subject_alternative_names" {
      description = "Set of domains that should be SANs in the issued certificate. To remove all elements of a previously configured list, set this value equal to an empty list ([]) or use the terraform taint command to trigger recreation."
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707847831067/1df5c1d5-5622-4afc-92fc-aa05a5c81de4.png)
    
* Save the file
    

### outputs.tf

* Input the following to define the return variables for the ACM validation
    
    ```plaintext
    output "domain_name" {
      description = "DNS Record validation"
      value = "${aws_route53_record.validation[var.domain_name].fqdn}"
    }
    
    output "subject_alternative_names" {
      description = "DNS Record validation"
      value = "${aws_route53_record.validation[var.subject_alternative_names].fqdn}"
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707847909290/c8d2e524-5aba-49df-a176-6632bd177817.png)
    
* Save the file
    

## route53

In this section, you will create an entry for Route53 "A" records

### main.tf

* Input the following:
    
    ```plaintext
    resource "aws_route53_record" "record" {
      zone_id = var.zone_id
      name    = var.name
      type    = var.type
      
      alias {
        name                   = var.alias_name
        zone_id                = var.alias_zone_id
        evaluate_target_health = true
      }
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707848079436/a4827550-cb45-4312-85c2-1ddd8edeb6a6.png)
    
* Save the file
    

### variables.tf

* Input the following to define the input variables for the Route53 A record
    
    ```plaintext
    variable "name" {
      description = "Name for Route53 CNAME Record. e.g. blog.example.com"
      type = string
    }
    
    variable "type" {
      description = "Type of DNS record"
      default = "A"
      type = string
    }
    
    variable "zone_id" {
      description = "Passed value from data.aws_route53_zone.my_domain.zone_id"
      type = string
    }
    
    variable "alias_name" {
      description = "Alias for A record"
      type = string
    }
    
    variable "alias_zone_id" {
      description = "Zone ID for A record"
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707848146324/6fc37814-22ca-47d1-a6cb-b8c9835e7038.png)
    
* Save the file
    

### outputs.tf

* Input the following to define the return variables
    
    ```plaintext
    output "name" {
      description = "The name of the record."
      value = aws_route53_record.record.name
    }
    
    output "fqdn" {
      description = "FQDN built using the zone domain and name."
      value = aws_route53_record.record.fqdn
    }
    
    output "type" {
      description = "The record type. Valid values are A, AAAA, CAA, CNAME, DS, MX, NAPTR, NS, PTR, SOA, SPF, SRV and TXT."
      value = aws_route53_record.record.type
    }
    
    output "ttl" {
      description = "The TTL of the record."
      value = aws_route53_record.record.ttl
    }
    
    output "zone_id" {
      description = "The ID of the hosted zone to contain this record."
      value = aws_route53_record.record.zone_id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707848246853/2cf99037-076b-4949-a377-107c5e1ee2a6.png)
    
* Save the file
    

---

## Modifying cloudfront\_distribution

Now that the entries for Route53 have been made, you will need to update your CloudFront distribution and create an alias and change the viewer\_certificate. Locate your cloudfront\_distribution files in `./infra/modules/aws/cloudfront_distribution`

### main.tf

* Modify main.tf to include the following:
    
    * Alias
        
    
    ```plaintext
    aliases             = ["${var.my_domain}"]
    ```
    
    > Before
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707849380909/45bdfd15-1517-4c84-a012-95f35fde1567.png)
    
    > After
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707849339974/a73ae142-6fdc-4d62-8ead-5851451d4eb5.png)
    
    * viewer\_certificate
        
        ```plaintext
        viewer_certificate {
            acm_certificate_arn      = var.valid_certificate_arn
            ssl_support_method       = var.ssl_support_method
            minimum_protocol_version = var.minimum_protocol_version
          }
        }
        ```
        
        > Before
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707849438655/5d0465e0-c485-4348-b1e1-fb9861e307c4.png)
        
        > After
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707849570938/32b6e44d-5fcc-48a0-a9d8-2634ca38433c.png)
        
* Save the file
    

### variables.tf

* Input the following to define the input variables for the updated values
    
    ```plaintext
    variable "my_domain" {
      description = "The name of the custom domain associated with Route53 and CloudFront"
      type = string
    }
    
    variable "valid_certificate_arn" {
      description = "Certificate ARN for Validation certificate from ACM"
      type = string
    }
    
    variable "ssl_support_method" {
      description = "How you want CloudFront to serve HTTPS requests. One of vip, sni-only, or static-ip. Required if you specify acm_certificate_arn or iam_certificate_id. NOTE: vip causes CloudFront to use a dedicated IP address and may incur extra charges."
      type = string
      default = "sni-only"
    }
    
    variable "minimum_protocol_version" {
      description = "Minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections. Can only be set if cloudfront_default_certificate = false. See all possible values in this table under \"Security policy.\" Some examples include: TLSv1.2_2019 and TLSv1.2_2021. Default: TLSv1. NOTE: If you are using a custom certificate (specified with acm_certificate_arn or iam_certificate_id), and have specified sni-only in ssl_support_method, TLSv1 or later must be specified. If you have specified vip in ssl_support_method, only SSLv3 or TLSv1 can be specified. If you have specified cloudfront_default_certificate, TLSv1 must be specified."
      type = string
      default = "TLSv1.2_2021"
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707851780528/177076be-4b36-4163-a47b-dc0f56fac3a5.png)
    
* Save the file
    
* There are no additional outputs that need to be defined
    

---

## Modifying s3\_cloudfront\_site

Because the cloudfront\_distribution module has been updated, you will need to update the s3\_cloudfront\_site module that calls that module.

### main.tf

* Input the following to update the cloudfront\_distribution module
    
    ```plaintext
      my_domain                   = var.domain_name
      valid_certificate_arn       = var.certificate
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707868076595/5192b6cf-8607-4603-aa64-c48d96f26747.png)
    

### variables.tf

* Input the following to include the new input variables
    
    ```plaintext
    variable "certificate" {
      description = "Certificate issued by ACM"
      type = string
    }
    
    variable "domain_name" {
      description = "The name of the custom domain associated with Route53 and CloudFront"
      type        = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707868106960/79d27d48-6ab7-4241-90c3-b8cab06376ee.png)
    
* Save the file
    
* There are no additional outputs that need to be defined
    

---

## Modifying api\_gateway\_domain

In this section, you will create the custom domain name for your API Gateway. Locate your api\_gateway\_domain files in `./infra/modules/aws/api_gateway/api_gateway_domain`.

### main.tf

* Input the following to create an API custom domain
    
    ```plaintext
    resource "aws_api_gateway_domain_name" "api" {
      certificate_arn = var.certificate_arn
      domain_name     = var.domain_name
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707867238210/39a1be03-44f1-4e83-bede-8f06a1dc7021.png)
    
* Save the file
    

### variables.tf

* Input the following to define the input variables
    
    ```plaintext
    variable "certificate_arn" {
      description = "Optional) ARN for an AWS-managed certificate. AWS Certificate Manager is the only supported source. Used when an edge-optimized domain name is desired. Conflicts with certificate_name, certificate_body, certificate_chain, certificate_private_key, regional_certificate_arn, and regional_certificate_name."
      type = string
    }
    
    variable "domain_name" {
      description = "The name of the custom domain associated with Route53 and CloudFront"
      type = string
    }
    ```
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707867394038/a518d30b-d1d4-47b7-90e0-3da9f74d9601.png)

* Save the file
    

### outputs.tf

* Input the following to define the return values
    
    ```plaintext
    output "domain_name" {
      description = "(Required) Fully-qualified domain name to register."
      value = aws_api_gateway_domain_name.api.domain_name
    }
    
    output "arn" {
      description = "ARN of domain name."
      value = aws_api_gateway_domain_name.api.arn
    }
    
    output "certificate_upload_date" {
      description = "Upload date associated with the domain certificate."
      value = aws_api_gateway_domain_name.api.certificate_upload_date
    }
    
    output "cloudfront_domain_name" {
      description = "Hostname created by Cloudfront to represent the distribution that implements this domain name mapping."
      value = aws_api_gateway_domain_name.api.cloudfront_domain_name
    }
    
    output "cloudfront_zone_id" {
      description = "For convenience, the hosted zone ID (Z2FDTNDATAQYW2) that can be used to create a Route53 alias record for the distribution."
      value = aws_api_gateway_domain_name.api.cloudfront_zone_id
    }
    
    output "id" {
      description = "Internal identifier assigned to this domain name by API Gateway."
      value = aws_api_gateway_domain_name.api.id
    }
    
    output "regional_domain_name" {
      description = "Hostname for the custom domain's regional endpoint."
      value = aws_api_gateway_domain_name.api.regional_domain_name
    }
    
    output "regional_zone_id" {
      description = "Hosted zone ID that can be used to create a Route53 alias record for the regional endpoint."
      value = aws_api_gateway_domain_name.api.regional_zone_id
    }
    
    output "tags_all" {
      description = "Map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
      value = aws_api_gateway_domain_name.api.tags_all
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707867554088/47190d49-241c-46bd-8886-320102f69de3.png)
    
* Save the file
    

---

### Modifying api\_gateway\_deployment

In this section, you will point your currently deployed API Gateway to the custom domain name.

### main.tf

* Input the following to create the base path mapping for your API Gateway
    
    ```plaintext
    resource "aws_api_gateway_base_path_mapping" "api_domain_map" {
      api_id      = var.api_id
      stage_name  = aws_api_gateway_stage.stage.stage_name
      domain_name = var.domain_name
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707873226891/ab6eccc9-9425-4146-9fbe-477d6a924194.png)
    
* Save the file
    

### variables.tf

* Input the following to define the input variable for domain\_name
    
    ```plaintext
    variable "domain_name" {
      description = "(Required) Already-registered domain name to connect the API to."
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707873300103/579f887e-c51a-41fe-b9c9-3865f8b3a570.png)
    
* Save the file
    

---

## Modifying my\_portfolio

In this section, you will update your static\_website module and include entries for the ACM certificate and Route53.

### main.tf

* Include the following
    
    ```plaintext
      domain_name       = var.domain_name
      certificate       = module.acm.validation_certificate_arn
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707868755378/74488578-59c0-46c0-9106-db133c77149b.png)
    
* Include the following to update your api\_deployment
    
    ```plaintext
    domain_name = var.api_domain_name
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707873421300/b7503de2-bbfc-4754-b8cd-f0f7ff9ac45d.png)
    

* Include the following to create the ACM certificate
    
    ```plaintext
    module "acm" {
      source = "../aws/acm"
    
      domain_name         = var.my_domain
      subject_alternative_names = [var.subject_alternative_names]
      validation_record   = [ 
        module.acm_validation.domain_name,
        module.acm_validation.subject_alternative_names
      ]
    }
    
    module "acm_validation" {
      source = "../aws/route53/acm_validation"
    
      domain_validation_options = module.acm.domain_validation_options
      zone_id                   = data.aws_route53_zone.my_domain.zone_id
      domain_name               = var.my_domain
      subject_alternative_names = var.subject_alternative_names
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707868840893/91e2cf07-90d3-4588-b287-883bd404902d.png)
    
    * Input the following to define the API Gateway domain name
        
        ```plaintext
        module "api_gateway_domain" {
          source = "../aws/api_gateway/api_gateway_domain"
        
          certificate_arn = module.acm.validation_certificate_arn
          domain_name     = var.api_domain_name
        }
        
        # Amazon Route53
        module "api_record" {
          source = "../aws/route53"
        
          zone_id       = data.aws_route53_zone.my_domain.zone_id
          name          = module.api_gateway_domain.domain_name
          alias_name    = module.api_gateway_domain.cloudfront_domain_name
          alias_zone_id = module.api_gateway_domain.cloudfront_zone_id
        
          depends_on = [ module.acm.validation_certificate_arn ]
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707869104187/d0b74904-6e1d-425f-8437-d88f124d4c3a.png)
        
* Input the following to define the Route53 record for your CloudFront Distribution
    
    ```plaintext
    module "cloudfront_record" {
      source = "../aws/route53"
    
      zone_id       = data.aws_route53_zone.my_domain.zone_id
      name          = var.my_domain
      alias_name    = module.static_website.cloudfront_domain_name
      alias_zone_id = module.static_website.cloudfront_hosted_zone_id
    
      depends_on = [module.acm.validation_certificate_arn ]
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707870133517/080a7e24-029a-4ecb-b4f9-f1113e6366f3.png)
    
* Save the file
    

### variables.tf

* Input the following to define the input variables for this module
    
    ```plaintext
    variable "my_domain" {
      description = "The name of the custom domain associated with Route53 and CloudFront"
      type        = string
    }
    
    variable "subject_alternative_names" {
      description = "Alternative name for custom domain"
      type = string
    }
    
    variable "api_domain_name" {
      description = "The name of the custom domain associated with Route53 and CloudFront"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707869466775/71187a08-39ad-4542-a206-9270a8427bff.png)
    
* Save the file
    

### data.tf

* Input the following to define the data block for your domain
    
    ```plaintext
    data "aws_route53_zone" "my_domain" {
      name         = var.my_domain
      private_zone = false
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707869537265/0fa7011b-54b5-48fa-9868-40ea7ce9daf1.png)
    
* Save the file
    

---

## Modifying ./infra/main.tf

* Input the following to define the input variables for the my\_portfolio module
    
    ```plaintext
    my_domain = "YOUR_DOMAIN_NAME"
      api_domain_name = "YOUR_API_DOMAIN_NAME"
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707869724874/f35c5e9e-555f-492c-b9f2-061759fb2097.png)
    
* Save the file
    

---

## Updating JavaScript files

In this section, you will update your JavaScript files to include your new API Gateway custom domain.

### views.js

* Update your JavaScript file to include your new URL
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707871288875/85cb7014-7067-4245-88de-28723397bbd2.png)
    
* Save the file
    

### sns.js

* Update your JavaScript file to include your new URL
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707871360334/7dd0d0db-c88e-451a-83fb-4b2d4747a7a2.png)
    
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
git commit -m "Created ACM certificate and Route53 entries for API Gateway and CloudFront"
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

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707507381035/e7ab7b40-f5a5-4146-bbd2-c7e953f8ac1d.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707870713973/52db8e55-d07b-47c0-99db-2cef5b8b7d95.png)

> Note: My plan outputs will be different due to having an already existing ACM certificate.

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

* Visit your custom domain
    
* Validate your Viewer Count populates with a value
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707871685529/b4730106-d26c-4e80-ac46-218540b3f075.png)

* Test your SNS functionality and ensure you are able to receive emails
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707872320823/3bf31803-13cb-499c-91c5-6e11e254daa0.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707872334611/3c8cd13e-7678-4b14-b785-6c7970e8d28c.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707872971529/5b381cd8-1c8e-47aa-bbc5-609eb7586998.png)

---

You have successfully implemented all aspects of deploying a mirror image of my Cloud Portfolio website!

[Next Module](./step_12.md)