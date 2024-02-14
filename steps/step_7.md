# Creating SNS Topic and Subscription

In this module, you will create a Simple Notification Service (SNS) Topic and an SNS email subscription for your site contact form. This will enable visitors to send emails to you via your website.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707504353464/6cf50d2e-b744-4589-868d-b28a8afca56a.jpeg align="center")

---

[Terraform SNS Topic Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic)

[Terraform SNS Subscription Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription)

---

## Create a new branch in GitHub

* Login to GitHub
    
* Select the **Issues** tab &gt; Select **New Issue**
    
* Add the a title, e.g. **Create SNS Topic and Subscription**
    
* Select **Submit new issue**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707504720253/9a45e80a-2b8f-4a56-bc94-24f8978f44a0.png align="center")

* On the right pane, under Development, Select **Create a branch**
    
* Leave the defaults &gt; Select **Create branch**
    
* Open your IDE Terminal.
    
* Input the following:
    

```plaintext
git fetch origin
```

```plaintext
git checkout YOUR_BRANCH_NAME
```

---

## Modifying sns files

In this section, you will be modifying the main, variables and outputs Terraform files located in `./infra/modules/aws/sns/`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707504909138/e76bb858-f9b9-4a67-a7d9-48caa71efe48.png align="center")

### main.tf

* To create an SNS Topic, modify your `./infra/modules/aws/sns/main.tf`
    
    * Input the following:
        
        ```plaintext
        resource "aws_sns_topic" "topic" {
          name = var.name
          display_name = var.display_name
        }
        ```
        
        > The display\_name variable will display how the FROM email address will be shown.
        
* To create the SNS Subscription, input the following:
    
    ```plaintext
    resource "aws_sns_topic_subscription" "subscription" {
      topic_arn = aws_sns_topic.topic.arn
      protocol  = var.protocol
      endpoint  = var.endpoint
    }
    ```
    
    > The SNS subscription will determine how the SNS Topic will be utilized. In this case, it will be used as an EMAIL protocol. The endpoint will be your email address.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707505287357/1aa879ee-527e-44ac-b67a-b94ae7c1f36d.png align="center")
    
* Save the file
    

### variables.tf

* Input the following to define the input variables:
    
    ```plaintext
    # SNS Topic
    variable "name" {
      description = "(Optional) The name of the topic. Topic names must be made up of only uppercase and lowercase ASCII letters, numbers, underscores, and hyphens, and must be between 1 and 256 characters long. For a FIFO (first-in-first-out) topic, the name must end with the .fifo suffix. If omitted, Terraform will assign a random, unique name. Conflicts with name_prefix"
      type = string
    }
    
    variable "display_name" {
      description = "(Optional) The display name for the topic"
      type = string
    }
    
    # SNS Subscription
    variable "protocol" {
      description = "(Required) Protocol to use. Valid values are: sqs, sms, lambda, firehose, and application. Protocols email, email-json, http and https are also valid but partially supported."
      type = string
    }
    
    variable "endpoint" {
      description = "(Required) Endpoint to send data to. The contents vary with the protocol."
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707505828870/6f6cf0de-80fd-491d-b42b-3183fe0361b0.png align="center")
    
* Save the file
    

### outputs.tf

* Input the following to define your return variables:
    
    ```plaintext
    # SNS Topic
    output "topic_id" {
      description = "The ARN of the SNS topic"
      value = aws_sns_topic.topic.id
    }
    
    output "topic_arn" {
      description = "The ARN of the SNS topic, as a more obvious property (clone of id)"
      value = aws_sns_topic.topic.arn
    }
    
    output "tags_all" {
      description = "A map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
      value = aws_sns_topic.topic.tags_all
    }
    
    output "beginning_archive_time" {
      description = "The oldest timestamp at which a FIFO topic subscriber can start a replay."
      value = aws_sns_topic.topic.beginning_archive_time
    }
    
    # SNS subscription
    output "sub_arn" {
      description = "ARN of the subscription."
      value = aws_sns_topic_subscription.subscription.arn
    }
    
    output "confirmation_was_authenticated" {
      description = "Whether the subscription confirmation request was authenticated."
      value = aws_sns_topic_subscription.subscription.confirmation_was_authenticated
    }
    
    output "sub_id" {
      description = "ARN of the subscription."
      value = aws_sns_topic_subscription.subscription.id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707505959204/df3ba1f1-06ba-4e2b-85c8-907b0415467b.png align="center")
    
    > These are optional as there are no required outputs for my\_portfolio or the ./infra/main.tf
    
* Save the file
    

---

## Modifying my\_portfolio files

In this section, you will modify the terraform files within `./infra/modules/my_portfolio`.

### main.tf

* Input the following to define the SNS module block:
    
    ```plaintext
    module "sns" {
      source = "../aws/sns"
    
      name         = var.topic_name
      display_name = var.topic_display_name
      protocol     = var.topic_protocol
      endpoint     = var.topic_endpoint
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707506271891/126186e3-ace8-41c0-afd2-8db5656a221a.png align="center")
    
* Save the file
    

### variables.tf

* Input the following to define the input variables for the SNS module block:
    
    ```plaintext
    variable "topic_name" {
      description = "Name for SNS Topic"
      type = string
    }
    
    variable "topic_display_name" {
      description = "Display name for SNS topic. How the email will show FROM"
      type = string
    }
    
    variable "topic_protocol" {
      description = "Protocol used for SNS topic"
      type = string
      default = "email"
    }
    
    variable "topic_endpoint" {
      description = "Endpoint for SNS Topic"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707506402251/a7682598-db59-46b6-80ae-d7019cff6fd4.png align="center")
    
    > In this module, the topic\_protocol is given a default variable of "email".
    
* Save the file
    

### outputs.tf

* Input the following to define your return variables for this module:
    
    ```plaintext
    # SNS Topic
    output "topic_id" {
      description = "The ARN of the SNS topic"
      value = module.sns.topic_id
    }
    
    output "topic_arn" {
      description = "The ARN of the SNS topic, as a more obvious property (clone of id)"
      value = module.sns.topic_arn
    }
    
    output "topic_tags_all" {
      description = "A map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
      value = module.sns.tags_all
    }
    
    output "beginning_archive_time" {
      description = "The oldest timestamp at which a FIFO topic subscriber can start a replay."
      value = module.sns.beginning_archive_time
    }
    
    # SNS subscription
    output "sub_arn" {
      description = "ARN of the subscription."
      value = module.sns.sub_arn
    }
    
    output "confirmation_was_authenticated" {
      description = "Whether the subscription confirmation request was authenticated."
      value = module.sns.confirmation_was_authenticated
    }
    
    output "sub_id" {
      description = "ARN of the subscription."
      value = module.sns.sub_id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707506622590/bf8c91a6-cfe2-499f-821b-3abdf9a0d325.png align="center")
    
    > These outputs are optional.
    
* Save the file
    

---

## Modifying ./infra/main.tf

### main.tf

* Modify your `./infra/main.tf`
    
    * Input the following:
        
        ```plaintext
          # SNS
          topic_name = "Email_from_my_website"
          topic_display_name = "Contact Me!"
          topic_endpoint = "YOUR_EMAIL_ADDRESS"
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707508205409/94497e04-ae95-4520-9b0a-c2c2440f470b.png align="center")
        

### variables.tf and outputs.tf

* Since the file\_path has been hard coded, you do not have to modify your variables.tf
    
* Optionally, you can include the outputs.tf. Based off the example above:
    

```plaintext
# SNS Topic
output "topic_id" {
  description = "The ARN of the SNS topic"
  value = module.my_static_website.topic_id
}

output "topic_arn" {
  description = "The ARN of the SNS topic, as a more obvious property (clone of id)"
  value = module.my_static_website.topic_arn
}

output "topic_tags_all" {
  description = "A map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
  value = module.my_static_website.topic_tags_all
}

output "beginning_archive_time" {
  description = "The oldest timestamp at which a FIFO topic subscriber can start a replay."
  value = module.my_static_website.beginning_archive_time
}

# SNS subscription
output "sub_arn" {
  description = "ARN of the subscription."
  value = module.my_static_website.sub_arn
}

output "confirmation_was_authenticated" {
  description = "Whether the subscription confirmation request was authenticated."
  value = module.my_static_website.confirmation_was_authenticated
}

output "sub_id" {
  description = "ARN of the subscription."
  value = module.my_static_website.sub_id
}
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707507235716/a5a9b257-d656-44f9-992b-01889c18fa0a.png align="center")

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
git commit -m "Created SNS topic and subscription for email notifications"
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

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707507381035/e7ab7b40-f5a5-4146-bbd2-c7e953f8ac1d.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707496920823/d8e662b6-7ac7-4340-bf78-05b52d5a12bc.png align="center")

> If you are using the same site files from the original template, the plan to add 2 should match.

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

* Check your email and confirm the subscription
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707508661052/17174a62-4f45-47a3-9e24-e90d15d78caa.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707508673615/6b14d727-380a-4305-9bf7-f40060ab443d.png align="center")

* AWS Management Console:
    
* In the Search bar, search for "sns" &gt; Select **Topics**
    
* You should see your new SNS Topic listed
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707508824051/b35a27ca-7c8e-40b7-9257-72214becd592.png align="center")

* Select Subscriptions:
    
    * You should see your email address confirmed if you selected the Confirm subscription from the email that you received.
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707508984521/98c22124-a80d-41b3-94ee-e9f9cec2296d.png align="center")

---

You have completed this module and created your SNS topic and subscription. In the next module, you will upload the Lambda functions from the `lambda` folder and test each to interact with your DynamoDB table and SNS Topic.

[Next Module](./step_8.md)