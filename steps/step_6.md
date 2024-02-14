# Creating DynamoDB Table

In this module, you will create a DynamoDB table and table item for your visitor count. This will store your visitor counts whenever someone loads your site.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707408963056/7aac94b5-8cf5-48a5-b1b9-4741270b308d.jpeg align="center")

> Note: This data will be added later to be viewable on your site.

---

[Terraform DynamoDB Table Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table)

[Terraform DynamoDB Table Item Reference](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table_item)

---

## Create a new branch in GitHub

* Login to GitHub
    
* Select the **Issues** tab &gt; Select **New Issue**
    
* Add the a title, e.g. **Create DynamoDB table with table item**
    
* Select **Submit new issue**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707409163295/9af109ae-9ecd-4b37-8b83-98f6f2c61573.png align="center")

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

## Modifying dynamodb

* In this section, you will create the DynamoDB table. Locate the `dynamodb` folder in `./infra/modules/aws`.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707416290716/a0bf9010-4bec-4798-b2e6-dd726a4ab9b5.png align="center")

### main.tf

* To create the DynamoDB table, input the following:
    
    ```plaintext
    resource "aws_dynamodb_table" "table" {
      name           = var.name
      billing_mode   = var.billing_mode
      read_capacity  = var.read_capacity
      write_capacity = var.write_capacity
      hash_key       = var.hash_key
    
      attribute {
        name = var.hash_key
        type = var.type
      }
    
      ttl {
        attribute_name = var.attribute
        enabled        = var.enabled
      }
    
      tags = {
        Name        = "${var.name}"
        Environment = "${var.environment}"
      }
    
      lifecycle {
        ignore_changes = [ ttl ]
      }
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707414755881/276e752b-8c61-46dc-a5a3-346d496a90d3.png align="center")
    
    > This will create the DynamoDB table. Majority of the variables will be defined with default values.
    
* Save the file
    

### variables.tf

* Input the following to create variables for each of the arguments:
    
    ```plaintext
    variable "attribute" {
      description = "(Required) Set of nested attribute definitions. Only required for hash_key and range_key attributes."
      type = string
      default = "TimeToExist"
    }
    
    variable "enabled" {
      description = "(Required) Whether TTL is enabled."
      type = bool
      default = false
    }
    
    variable "environment" {
      description = "Tag value for what environment this applies to."
      type = string
      default = "Development"
    }
    
    variable "hash_key" {
      description = "(Required, Forces new resource) Attribute to use as the hash (partition) key. Must also be defined as an attribute"
      type = string
    }
    
    variable "name" {
      description = "(Required) Unique within a region name of the table."
      type = string
    }
    
    variable "billing_mode" {
      description = "(Optional) Controls how you are charged for read and write throughput and how you manage capacity. The valid values are PROVISIONED and PAY_PER_REQUEST. Defaults to PROVISIONED."
      type = string
      default = "PROVISIONED"
    }
    
    variable "read_capacity" {
      description = "(Optional) Number of read units for this table. If the billing_mode is PROVISIONED, this field is required."
      type = number
      default = 5
    }
    
    variable "type" {
      description = "(Required) Attribute type. Valid values are S (string), N (number), B (binary)."
      type = string
    }
    
    variable "write_capacity" {
      description = "(Optional) Number of write units for this table. If the billing_mode is PROVISIONED, this field is required."
      type = number
      default = 5
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707415051473/c43815b4-a159-441b-987e-16fc18f528c1.png align="center")
    
    > The only variables without default values are the `name`, `hash_key`, and `type` entries.
    
* Save the file
    

### outputs.tf

* Here are some default output variables that you can include.
    
    * Input the following:
        
        ```plaintext
        output "arn" {
          description = "ARN of the table"
          value = aws_dynamodb_table.table.arn
        }
        
        output "id" {
          description = "Name of the table"
          value = aws_dynamodb_table.table.id
        }
        
        output "hash_key" {
          description = "Hash key to use for lookups and identification of the item"
          value = aws_dynamodb_table.table.hash_key
        }
        
        output "name" {
          description = "Name of the table"
          value = aws_dynamodb_table.table.name
        }
        
        output "tags_all" {
          description = "Map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
          value = aws_dynamodb_table.table.tags_all
        }
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707416126637/0d9bdfd3-8981-42b0-969a-a0308f3e60d3.png align="center")
        
        > The only required outputs are the `name` and `hash_key` values.
        
* Save the file
    

---

## Modifying dynamodb\_table\_item

* Within the `./infra/modules/aws/dynamodb`, there is a subfolder named `dynamodb_table_item`. Here you will modify the Terraform files associated with that module.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707416270067/11e54679-664c-486d-b117-8749358c0364.png align="center")
    

### main.tf

* Input the following to create your table item
    
    ```plaintext
    resource "aws_dynamodb_table_item" "item" {
      table_name = var.table_name
      hash_key   = var.hash_key
    
      item = var.item
      
      lifecycle {
        ignore_changes = [ item ]
      }
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707417329045/a261cc1f-b2de-4aac-bd32-8ab3ac17fa60.png align="center")
    
    > This will create a table item for Table that will be created and will use the hash\_key associated with that table.
    > 
    > The lifecycle ignore\_changes will not attempt to update the item variable back to it's defined value when `terraform apply` is executed. The table item will be the actual value of your visitor count, so you do not want this to be overwritten each time.
    
* Save the file
    

### variables.tf

* Input the following to define the values for each entry:
    
    ```plaintext
    variable "table_name" {
      description = "(Required) Name of the table to contain the item"
      type = string
    }
    
    variable "hash_key" {
      description = "(Required) Hash key to use for lookups and identification of the item"
      type = string
    }
    
    variable "item" {
      description = "(Required) JSON representation of a map of attribute name/value pairs, one for each attribute. Only the primary key attributes are required; you can optionally provide other attribute name-value pairs for the item."
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707417515646/c51f390d-9f12-4735-91d9-050d9eb475aa.png align="center")
    
* Save the file.
    

> Note there is no requirement for any output variable definitions.

---

## Modifying dynamodb\_table

* In this section, you will combine the DynamoDB Table and DynamoDB Table Item into a singular module. Locate the `dynamodb_table` folder in `./infra/modules/dynamodb_table`.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707418691346/36b63556-2e31-4a76-8005-d403a5f1665c.png align="center")

### main.tf

* Include the following:
    
    ```plaintext
    module "dynamodb" {
      source = "../aws/dynamodb"
    
      name           = var.table_name
      hash_key       = var.hash_key
      type           = var.type
    }
    
    module "dynamodb_item" {
      source = "../aws/dynamodb/dynamodb_table_item"
    
      table_name = module.dynamodb.name
      hash_key   = module.dynamodb.hash_key
      item       = var.table_item
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707419287913/eacda937-1a07-4689-b251-8665e5b4f451.png align="center")
    
    > This module will create the DynamoDB table and table item associated with the table.
    
* Save the file
    

### variables.tf

* Input the following to define variable inputs:
    
    ```plaintext
    variable "table_name" {
      description = "Name for DynamoDB table"
      type = string
    }
    
    variable "hash_key" {
      description = "Hash key for DynamoDB table"
      type = string
    }
    
    variable "type" {
      description = "Type value for hash key"
      type = string
    }
    
    variable "table_item" {
      description = "Item values for DynamoDB table"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707449316847/99ef03ec-eb4e-4e74-a1d2-f8061c63ee13.png align="center")
    
* Save the file
    

### outputs.tf

* Input the following for return values for this module:
    
    ```plaintext
    output "arn" {
      description = "ARN for DynamoDB table"
      value = module.dynamodb.arn
    }
    
    output "id" {
      description = "ID for DynamoDB table"
      value = module.dynamodb.id
    }
    
    output "table_name" {
      description = "Name of the table to contain the item"
      value = module.dynamodb.name
    }
    
    output "hash_key" {
      description = "Hash key to use for lookups and identification of the item"
      value = module.dynamodb.hash_key
    }
    
    output "tags_all" {
      description = "Tags associated with DynamoDB table"
      value = module.dynamodb.tags_all
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707449338980/e0cbb178-e9eb-4294-b511-4979d643e3a0.png align="center")
    
* Save the file
    

---

## Modifying my\_portfolio

* Modify your my\_portfolio module to include the creation of the DynamoDB table and table item
    

### main.tf

* Include the following to call the dynamodb\_table module:
    
    ```plaintext
    module "dynamodb" {
      source = "../dynamodb_table"
    
      table_name     = var.table_name
      hash_key       = var.hash_key
      type           = var.type
      table_item     = var.table_item
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707449569848/ba835786-0ad3-4c70-9b44-dec685c3fd65.png align="center")
    
* Save the file
    

### variables.tf

* Include the following to define the variables for the dynamodb module:
    
    ```plaintext
    variable "table_name" {
      description = "Name for DynamoDB table"
      type = string
    }
    
    variable "hash_key" {
      description = "Hash key for DynamoDB table"
      type = string
    }
    
    variable "type" {
      description = "Type value for hash key"
      type = string
    }
    
    variable "table_item" {
      description = "Item values for DynamoDB table"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707449639023/9cbeaaa6-bef2-40ba-8681-dab0aa963994.png align="center")
    
    * Save the file
        

### outputs.tf

* Input the following for return values for this module:
    
    ```plaintext
    output "table_arn" {
      description = "ARN for DynamoDB table"
      value = module.dynamodb.arn
    }
    
    output "table_id" {
      description = "ID for DynamoDB table"
      value = module.dynamodb.id
    }
    
    output "table_name" {
      description = "Name of the table to contain the item"
      value = module.dynamodb.table_name
    }
    
    output "hash_key" {
      description = "Hash key to use for lookups and identification of the item"
      value = module.dynamodb.hash_key
    }
    
    output "table_tags_all" {
      description = "Tags associated with DynamoDB table"
      value = module.dynamodb.tags_all
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707496293943/2680ae84-aed1-4c4b-ae3e-c6309663084b.png align="center")
    
* Save the file
    

---

## Modifying ./infra/main.tf

## main.tf

* Modify your `./infra/main.tf`
    
    * Input the following:
        
        ```plaintext
          # DynamoDB
          table_name = "my_site_visitors"
          hash_key = "Id"
          type = "N"
          table_item = <<ITEM
        {
          "Id": {"N": "0"},
          "value": {"N": "0"}
        }
        ITEM
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707496843178/234f9e8f-f95b-4e7a-8b1b-7d0778d0b89a.png align="center")
        
        > The table\_item is a heredoc that defines the structure of the DynamoDB Table.
        

### variables.tf and outputs.tf

* Since the variables have been hard-coded, you do not have to modify your variables.tf
    
* There are no mandatory outputs, but you can include the following if you wish to receive those outputs:
    
    ```plaintext
    output "table_arn" {
      description = "ARN for DynamoDB table"
      value = module.my_static_website.table_arn
    }
    
    output "table_id" {
      description = "ID for DynamoDB table"
      value = module.my_static_website.table_id
    }
    
    output "table_name" {
      description = "Name of the table to contain the item"
      value = module.my_static_website.table_name
    }
    
    output "hash_key" {
      description = "Hash key to use for lookups and identification of the item"
      value = module.my_static_website.hash_key
    }
    
    output "table_tags_all" {
      description = "Tags associated with DynamoDB table"
      value = module.my_static_website.table_tags_all
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707495860144/bdfba1ac-b7d0-4003-88d7-05fdda3299f5.png align="center")
    
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
git commit -m "Created DynamoDB table and table item for viewer count"
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

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707496159291/a7dbdcfc-4e39-4d1e-93e7-a4c8f087de6a.png align="center")

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

* AWS Management Console:
    
* In the Search bar, search for "dynamodb" &gt; Select Tables
    
* You should see your new table listed under the Tables section
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707497382163/19c05f9d-967f-43ad-87b3-0aef13a4e4ab.png align="center")

* Under Tables &gt; Select **Explore items** &gt; Select your table
    
* You should see the values set as below:
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707497465464/6eff5bab-1ace-436a-9f18-891799540902.png align="center")
    
    > In the later modules, you will validate the Table item `value` being updated via your Lambda function.
    

---

You have successfully created your DynamoDB table. In the next module, you will create your SNS topic and subscription to send you emails from your website contact form.

[Next Module](./step_7.md)