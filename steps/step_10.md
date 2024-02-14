# Integrating API Gateway

In this module, you will be updating your HTML and JavaScript files to integrate your API Gateway resources. You will also make modifications to your `terraform-apply_cloudfront-invalidation.yml` to invalidate your CloudFront Distribution. The invalidation will update CloudFront so that you will get an updated view of your site files once the modifications to your HTML and JavaScript are uploaded.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707811310171/383ef81a-0007-4292-9e28-397dbba87549.jpeg)

---

## Create a new branch in GitHub

* Login to GitHub.
    
* Select the Issues tab &gt; Select New Issue.
    
* Add the a title, e.g. **Integrate API Gateway with HTML and JavaScript**
    
* Select Submit new issue.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707803570043/528e2f19-91d1-4f9d-9825-4bfa1262410e.png)

* On the right pane, under Development, Select Create a branch.
    
* Leave the defaults &gt; Select Create branch.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707803608187/e16b2c57-19b2-45a3-ad09-804eca19f233.png)

* Open your IDE Terminal.
    
* Input the following:
    

```plaintext
git fetch origin
```

```plaintext
git checkout YOUR_BRANCH_NAME
```

---

## Create API Gateway Deployment

In this section, you will deploy an API Gateway Stage so that it be called via your JavaScript files.

* Locate your api\_gateway\_deployment Terraform files in `./infra/modules/aws/api_gateway/api_gateway_deployment`.
    

### main.tf

* Input the following to create the deployment and stage for your API Gateway
    

```plaintext
resource "aws_api_gateway_deployment" "deploy" {
  rest_api_id = var.api_id

  triggers = {
    # NOTE: The configuration below will satisfy ordering considerations,
    #       but not pick up all future REST API changes. More advanced patterns
    #       are possible, such as using the filesha1() function against the
    #       Terraform configuration file(s) or removing the .id references to
    #       calculate a hash against whole resources. Be aware that using whole
    #       resources will show a difference after the initial implementation.
    #       It will stabilize to only change when resources change afterwards.
    redeployment = sha1(jsonencode(
        var.redeployment
        ))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.deploy.id
  rest_api_id   = var.api_id
  stage_name    = var.stage_name
}
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707807871774/6ff6082c-0c7b-413e-953b-b7a80ec9376c.png)

* Save the file
    

### variables.tf

* Input the following to define the input variables for this module
    
    ```plaintext
    variable "api_id" {
      description = "(Required) REST API identifier."
      type = string
    }
    
    variable "redeployment" {
      description = "(Optional) Map of arbitrary keys and values that, when changed, will trigger a redeployment. To force a redeployment without changing these keys/values, use the -replace option with terraform plan or terraform apply."
      type = list(string)
    }
    
    variable "stage_name" {
      description = "Optional) Name of the stage to create with this deployment. If the specified stage already exists, it will be updated to point to the new deployment. We recommend using the aws_api_gateway_stage resource instead to manage stages."
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707807947282/d271a012-622b-4261-a5d9-0d934eca362f.png)
    
* Save the file
    
* There is no requirement for outputs for the deployment or stage of the API Gateway
    

---

## Modifying my\_portfolio/main.tf

### main.tf

* Include the following to create the API Gateway Deployment and Stage
    
    ```plaintext
    module "api_deployment" {
      source = "../aws/api_gateway/api_gateway_deployment"
    
      api_id = module.api.id
      redeployment = [
        module.api_resource_dynamodb.integration_response,
        module.api_resource_dynamodb.method,
        module.api_resource_dynamodb.integration,
        module.api_resource_dynamodb.api_resource,
        module.api_resource_sns.integration_response,
        module.api_resource_sns.method,
        module.api_resource_sns.integration,
        module.api_resource_sns.api_resource
        ]
      stage_name = "development"
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707808234973/446dc696-1420-4a0c-8223-384f47ac4620.png)
    
* Save the file
    

### variables.tf and outputs.tf

* There is no requirement to define these values because they are defined within this module.
    

---

## Navigating index.html

* Locate your index.html file in `./public/html_files`.
    

### Entries for DynamoDB

* Uncomment lines 56-58
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707805032077/873a9802-e31d-44be-82bd-fca64dcdd7b7.png)
    
    * Highlight the lines and hit "ctrl" + "/"
        
    * OR
        
    * remove `<!--` and `-->`
        
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707805058233/80d51946-db55-42e5-ba50-22b2f3a67c54.png)
    
    * This will show "My Views Count:" on the home page
        

### Entries for SNS

* Locate lines 201-222 in index.html
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707806026419/03b624a4-5c17-4af3-a3ad-16c06b820c5c.png)

> Note the names of each field. They include the requirements for the SNS Lambda function (name, email, phone, subject, body)

### Entries for scripts

* Scroll to the bottom of the index.html to lines 246-253
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707805444294/08d43c29-0159-4d36-9065-29fe5556050f.png)
    
* The scripts associated with interacting with the API Gateway are `views.js`, `sns.js`, and `https://cdn.jsdelivr.net/npm/sweetalert2@11`
    
    > Note the cdn.jsdelivr.net url is for a notification prompt for successful email
    
* Save the file
    

---

## Updating JavaScript files

* Login to AWS Management Console
    
* Search for "API Gateway" &gt; Select your API Gateway
    
* Take note of your API Gateway Resource ID
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707806804361/7aa525c7-4da2-4b78-b346-4599e4530021.png)
    
* When the API Gateway Stage is deployed from the previous section, the execution URL will appear like below:
    
    > https://YOUR\_API\_GATEWAY\_ID.execute-api.YOUR\_AWS\_REGION.amazonaws.com/development/emailme
    > 
    > https://YOUR\_API\_GATEWAY\_ID.execute-api.YOUR\_AWS\_REGION.amazonaws.com/development/viewers
    
* Full example:
    
    > https://akuaqoo6d5.execute-api.us-west-1.amazonaws.com/development/emailme
    > 
    > https://akuaqoo6d5.execute-api.us-west-1.amazonaws.com/development/viewers
    

### views.js

* Locate your views.js file in `./public/asset_files/assets/js`
    
* Replace INSERT\_YOUR\_API\_URL and input the viewers URL
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707807331055/cd770c9c-20a2-4b62-9fb6-6576d83f475e.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707807362624/9feeb9b0-4d12-41e2-b336-f5f3cd4facc0.png)

* Save the file
    

### sns.js

* Locate your sns.js file in `./public/asset_files/assets/js`
    
* Replace INSERT\_YOUR\_API\_URL and input the emailme URL
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707807463748/09e0083a-5443-4afc-839e-730ceaa50329.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707807492263/ecf25e85-9179-461f-94c2-fe51a0ca3fb9.png)

> Note lines 23-30. The SNS\_EMAIL function returns a {statusCode: 200} upon successful execution. If the response for this JavaScript function receives the statusCode 200, it will prompt the end user of a successful message using the sweetalert2 message similar to the image below:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707810503578/27995768-7354-4040-aa06-90a557cc7546.png)

* Save the file
    

---

### Updating terraform-apply\_cloudfront-invalidation.yml

In this section, you will update the terraform-apply\_cloudfront-invalidation.yml to include the CloudFront invalidation portion of the workflow.

* Locate your terraform-apply\_cloudfront-invalidation.yml in `./.github/workflows` folder
    
* Uncomment lines 60-98
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707808428823/2c0c8b7c-e8b4-47a7-9d98-1a0a6e3f2582.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707808460357/86e6fbc8-9328-4884-95c0-568f218d784f.png)

* You can either highlight lines 60-98 and hit "Ctrl" + "/" or remove the "#" from each line
    
* Save the file
    

### How CloudFront Invalidation is accomplished

#### get\_cloudfront\_id

* Upon completion of the Terraform Apply job, the get\_cloudfront\_id job is executed
    
    1. Your respository is checked out
        
    2. Terraform is installed on the runner
        
    3. Changes directory into `./infra/` and runs terraform init
        
    4. Changes directory into `./infra/` and defines `cloudfront_id` from the terraform output for cloudfront\_distribution\_id
        
    5. cloudfront\_id is passed as an output variable in the workflow
        

> This will pass the CloudFront ID for your CloudFront distribution defined in this deployment.

#### invalidate\_cloudfront

* Upon completion of get\_cloudfront\_id, the invalidate\_cloudfront job is executed
    
    1. Your repository is checked out
        
    2. Using AWS CLI, your CloudFront is invalidated using the CloudFront ID passed from the get\_cloudfront\_id output
        
        * The "/\*" invalidates all files associated with the distribution
            

---

## Pushing to GitHub

* Ensure your files are saved.
    
* In your IDE Terminal, type the following:
    

```plaintext
git add .
```

> Add all files that were changed.

```plaintext
git commit -m "Updated HTML and JavaScript files to interact with API Gateway. Created API Gateway deployment. Updated workflow to include CloudFront invalidation
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

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707809590087/95cc8750-9eb0-44d9-aa56-b5f1bdd71373.png)

> If you are using the same site files from the original template, the plan to add 2 and change 3 should match.

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

* Visit your CloudFront website
    
* You can get your URL from CloudFront
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707809735706/32b2d5c4-9e4c-421f-9cf3-5063cd9d4cba.png)

* You should see the My Views Count: NUMBER on your Home page
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707809849797/eec54967-325b-4c05-abee-e696158781e8.png)
    
* Test the functionality of your Messaging form
    
    * Input the following:
        
        ```plaintext
        Name = Thor
        Email = god_of_thunder@odinson.com
        Phone = 000000000
        Subject = “THIS DRINK, I LIKE IT! ANOTHER!”
        Message = "I'm Still Worthy."
        ```
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707810116059/0d9d62e7-1caf-4f5a-803b-0685503b0d90.png)
        
        * Hit SEND
            
    * You should get a prompt like below
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707810166485/4a5e0c1b-2aac-4b86-8b93-16db06a223dd.png)
        
* Check your email. You should receive an email like below.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707810212275/9bb96574-d37f-44a3-a30c-274da23ff2a9.png)
    

---

You have successfully integrated your API Gateway with your development site! You can now see how many visitors come to your page, and they can send you emails via your message form. In the next module, I will walk you through integrating a custom domain using Route53 for your CloudFront distribution and your API Gateway.

[Next Module](./step_11.md)