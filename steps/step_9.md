# Creating an API Gateway and API Resources/Methods

In this module, you will be creating your API Gateway and a couple of resources that will interact with your Lambda Functions from the previous module. You will create API resources that will utilize POST HTTP Methods. Once your API Gateway is deployed, I will walk you through testing your Lambda functions through the API Gateway to ensure proper functionality.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707782039652/97ce49ac-288d-44b2-b4e0-3d00075f24ca.jpeg)

---

[Terraform API Gateway REST API Referrence](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_rest_api)

---

## Create a new branch in GitHub

* Login to GitHub.
    
* Select the Issues tab &gt; Select New Issue.
    
* Add the a title, e.g. **Creating API Gateway and API Resources**
    
* Select Submit new issue.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706256775082/9eac1912-d6af-450d-a3e9-dde0ac552e5c.png)

* On the right pane, under Development, Select Create a branch.
    
* Leave the defaults &gt; Select Create branch.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706256924274/c6095345-5ba0-4427-8eb2-db4dc11849f4.png)

* Open your IDE Terminal.
    
* Input the following:
    

```plaintext
git fetch origin
```

```plaintext
git checkout YOUR_BRANCH_NAME
```

---

## Creating API Gateway

In this section you will be modifying the main, variables and outputs Terraform files located in `./infra/modules/aws/api_gateway/`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707760707118/4ddfff78-b58a-4838-b22d-e91854ac5658.png)

### main.tf

* Input the following to create the API Gateway:
    
    ```plaintext
    resource "aws_api_gateway_rest_api" "api" {
      name        = var.name
      description = var.description
    
       endpoint_configuration {
        types = var.types
      }
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707764512080/06c9b727-c596-4986-a9da-273eeca199ae.png)
    
    > This will create a REST API Gateway that will have resources and methods associated with it
    
* Save the file
    

### variables.tf

* Input the following to define the three variables:
    
    ```plaintext
    variable "name" {
      description = "(Required) Name of the REST API. If importing an OpenAPI specification via the body argument, this corresponds to the info.title field. If the argument value is different than the OpenAPI value, the argument value will override the OpenAPI value."
      type = string
    }
    
    variable "description" {
      description = "(Optional) Description of the REST API. If importing an OpenAPI specification via the body argument, this corresponds to the info.description field. If the argument value is provided and is different than the OpenAPI value, the argument value will override the OpenAPI value."
      type = string
    }
    
    variable "types" {
      description = "(Required) List of endpoint types. This resource currently only supports managing a single value. Valid values: EDGE, REGIONAL or PRIVATE. If unspecified, defaults to EDGE. If set to PRIVATE recommend to set put_rest_api_mode = merge to not cause the endpoints and associated Route53 records to be deleted. Refer to the documentation for more information on the difference between edge-optimized and regional APIs."
      type = list(string)
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707764541873/fd3b77bb-4bc5-4c39-8833-eadfde9f1d24.png)
    
* Save the file
    

### outputs.tf

* Input the following to define the return variables for the API Gateway module
    
    ```plaintext
    output "arn" {
      description = "The ARN of the REST API"
      value = aws_api_gateway_rest_api.api.arn
    }
    
    output "created_date" {
      description = "Creation date of the REST API"
      value = aws_api_gateway_rest_api.api.created_date
    }
    
    output "execution_arn" {
      description = "Execution ARN part to be used in lambda_permission's source_arn when allowing API Gateway to invoke a Lambda function, e.g., arn:aws:execute-api:eu-west-2:123456789012:z4675bid1j, which can be concatenated with allowed stage, method and resource path."
      value = aws_api_gateway_rest_api.api.execution_arn
    }
    
    output "id" {
      description = "ID of the REST API"
      value = aws_api_gateway_rest_api.api.id
    }
    
    output "root_resource_id" {
      description = "Resource ID of the REST API's root"
      value = aws_api_gateway_rest_api.api.root_resource_id
    }
    
    output "tags_all" {
      description = "Map of tags assigned to the resource, including those inherited from the provider default_tags configuration block."
      value = aws_api_gateway_rest_api.api.tags_all
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707764580610/9c11a61a-8216-4cd7-af8c-6e0fe6868d46.png)
    
    > The `id` and `root_resource_id` in particular will be required to create the resource and methods and associate it with the API gateway that will be created.
    
* Save the file
    

---

## Creating API Gateway Resource

In this section you will be modifying the main, variables and outputs Terraform files located in `./infra/modules/aws/api_gateway/api_gateway_resource`.

### main.tf

* Input the following to create the API Gateway resource
    
    ```plaintext
    resource "aws_api_gateway_resource" "resource" {
      rest_api_id = var.api_id
      parent_id   = var.parent_id
      path_part   = var.path_part
    }
    ```
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707771834925/c59fea3f-6fed-4127-82b3-0373ea649772.png)

> This will create a resource associated with the API Gateway.

* Save the file
    

### variables.tf

* Input the following to define the input variables for this module
    
    ```plaintext
    variable "api_id" {
      description = "(Required) ID of the associated REST API"
      type = string
    }
    
    variable "parent_id" {
      description = "(Required) ID of the parent API resource"
      type = string
    }
    
    variable "path_part" {
      description = "(Required) Last path segment of this API resource."
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707772097813/3c4c19f0-29bd-4ef0-be4f-281bad65eb17.png)
    
* Save the file
    

### outputs.tf

* Input the following to define the return variables for this module
    
    ```plaintext
    output "resource_id" {
      description = "Output API Gateway Resource ID for use for API Gateway Deployment"
      value = aws_api_gateway_resource.resource.id
    }
    
    output "path" {
      description = "Path value for API Gateway Resource"
      value = aws_api_gateway_resource.resource.path
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707773550801/55a5b75d-8077-4f1a-b720-20185ad00e2b.png)
    
* Save the file
    

---

## Creating API Gateway Resource Methods

In this section you will be modifying the main, variables and outputs Terraform files located in `./infra/modules/aws/api_gateway/api_gateway_resource/api_gateway_method`.

Four resources will be defined for the Resource Method (POST)

* Method Request
    
* Integration Request
    
* Integration Response
    
* Method Response
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707773938345/c55c07db-afd0-44dc-85d6-944ab18f4aaf.png)

### main.tf

#### method request:

* Input the following to create the method request
    
    ```plaintext
    resource "aws_api_gateway_method" "method" {
      rest_api_id    = var.api_id
      resource_id    = var.resource_id
      http_method    = var.http_method
      authorization  = var.authorization
    }
    ```
    

#### integration request

* Input the following to create the integration request
    
    ```plaintext
    resource "aws_api_gateway_integration" "integration" {
      rest_api_id             = var.api_id
      resource_id             = var.resource_id
      http_method             = aws_api_gateway_method.method.http_method  
      integration_http_method = var.integration_http_method
      type                    = var.type
      uri                     = var.uri
    
      request_templates = var.response_templates
    }
    ```
    

> Integration response will define what type of service this will be associated with. You will later define AWS for the AWS Lambda service

#### integration response

* Input the following to create the integration response
    
    ```plaintext
    resource "aws_api_gateway_integration_response" "IntegrationResponse" {
      rest_api_id = var.api_id
      resource_id = var.resource_id
      http_method = aws_api_gateway_method.method.http_method
      status_code = aws_api_gateway_method_response.response_200.status_code
    
      response_parameters = var.integration_response_parameters
    
      depends_on = [ 
        aws_api_gateway_integration.integration,
        aws_api_gateway_method.method
      ]
    }
    ```
    
    > Note: The depends\_on argument will force the IntegrationResponse resource to wait until the previous methods are created. Without the depends\_on argument, the integration response will be configured improperly and the API gateway will not function as intended.
    

#### method response

* Input the following to create the method response
    
    ```plaintext
    resource "aws_api_gateway_method_response" "response_200" {
      rest_api_id = var.api_id
      resource_id = var.resource_id
      http_method = aws_api_gateway_method.method.http_method
      status_code = 200
      
      response_parameters = var.method_response_parameters 
    
      response_models = var.response_models
    }
    ```
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707779019761/31f76ffb-223e-4437-9d75-41f7c689a4ed.png)

* Save the file
    

### variables.tf

* Input the following to define the variables for this module:
    
    ```plaintext
    variable "api_id" {
      description = "(Required) ID of the associated REST API"
      type = string
      nullable = false
    }
    
    # aws_api_gateway_mathod.method
    variable "http_method" {
      description = "(Required) HTTP Method (GET, POST, PUT, DELETE, HEAD, OPTIONS, ANY)"
      type = string
      default = "POST"
    }
    
    variable "authorization" {
      description = "(Required) Type of authorization used for the method (NONE, CUSTOM, AWS_IAM, COGNITO_USER_POOLS)"
      type = string
      default = "NONE"
    }
    
    # aws_api_gateway_integration.lambda_integration
    variable "type" {
      description = "(Required) Integration input's type. Valid values are HTTP (for HTTP backends), MOCK (not calling any real backend), AWS (for AWS services), AWS_PROXY (for Lambda proxy integration) and HTTP_PROXY (for HTTP proxy integration). An HTTP or HTTP_PROXY integration with a connection_type of VPC_LINK is referred to as a private integration and uses a VpcLink to connect API Gateway to a network load balancer of a VPC."
      type = string
      default = "AWS"
    }
    
    variable "integration_http_method" {
      description = "(Optional) Integration HTTP method (GET, POST, PUT, DELETE, HEAD, OPTIONs, ANY, PATCH) specifying how API Gateway will interact with the back end. Required if type is AWS, AWS_PROXY, HTTP or HTTP_PROXY. Not all methods are compatible with all AWS integrations. e.g., Lambda function can only be invoked via POST."
      type = string
      nullable = true
      default = null
    }
    
    variable "uri" {
      description = "(Optional) Input's URI. Required if type is AWS, AWS_PROXY, HTTP or HTTP_PROXY. For HTTP integrations, the URI must be a fully formed, encoded HTTP(S) URL according to the RFC-3986 specification . For AWS integrations, the URI should be of the form arn:aws:apigateway:{region}:{subdomain.service|service}:{path|action}/{service_api}. region, subdomain and service are used to determine the right endpoint. e.g., arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:012345678901:function:my-func/invocations. For private integrations, the URI parameter is not used for routing requests to your endpoint, but is used for setting the Host header and for certificate validation."
      type = string
      nullable = true
      default = null
    }
    
    # aws_api_gateway_method_response.response_200
    
    variable "method_response_parameters" {
      description = "(Optional) A map specifying required or optional response parameters that API Gateway can send back to the caller. A key defines a method response header name and the associated value is a boolean flag indicating whether the method response parameter is required. The method response header names must match the pattern of method.response.header.{name}, where name is a valid and unique header name."
      type = map(bool)
      default = {
        "method.response.header.Access-Control-Allow-Origin" = true
      }
    }
    
    variable "response_models" {
      description = "(Optional) A map specifying the model resources used for the response's content type. Response models are represented as a key/value map, with a content type as the key and a Model name as the value."
      type = map(string)
      default = {
        "application/json" = "Empty"
      }
    }
    
    # aws_api_gateway_integration_response.IntegrationResponse
    variable "integration_response_parameters" {
      description = "(Optional) Map of response parameters that can be read from the backend response. For example: response_parameters = %%{ \"method.response.header.X-Some-Header\" = \"integration.response.header.X-Some-Other-Header\" }."
      type = map(string)
      default = {
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
      }
    }
    
    variable "response_templates" {
      description = "(Optional) Map of templates used to transform the integration response body."
      type = map(string)
      default = {
        "application/json" = ""
      }
    }
    
    variable "resource_id" {
      description = "ID for API Gateway Resource"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707779879990/809c1ac7-5e22-4476-8740-bbf6b269a76c.png)
    
    > Here you define some default variable inputs for the POST method using default values.
    
* Save the file
    

### outputs.tf

* Input the following to define the return values for this module:
    
    ```plaintext
    output "method" {
      description = "Output API Gateway Resource Method for use for API Gateway Deployment"
      value = aws_api_gateway_method.method.id
    }
    
    output "integration" {
      description = "Output API Gateway Resource Integration Method for use for API Gateway Deployment"
      value = aws_api_gateway_integration.integration.id
    }
    
    output "integration_response" {
      description = "ID for API Gateway integration response"
      value = aws_api_gateway_integration_response.IntegrationResponse.id
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707779913235/e7be2e08-5bb2-403b-8024-da0cbe4542ee.png)
    
* Save the file
    

---

## Creating API Resource with CORS

In this section you will be modifying the main, variables and outputs Terraform files located in `./infra/modules/API_resource_with_CORS`. In order for the REST API to be accessible, CORS will need to be enabled with an OPTIONS method. The API Resource with CORS module will create the respective API Gateway resource, it's Method and an OPTIONS method.

### main.tf

* Input the following to create the resource, method and OPTIONS method for this module:
    
    ```plaintext
    module "api_resource" {
      source = "../aws/api_gateway/api_gateway_resource"
    
      api_id                  = var.api_id
      parent_id               = var.parent_id
      path_part               = var.path_part
    }
    
    module "api_methods" {
      source = "../aws/api_gateway/api_gateway_resource/api_gateway_method"
    
      api_id                  = var.api_id
      resource_id             = module.api_resource.resource_id
      integration_http_method = var.http_method
      uri                     = var.lambda_function
    }
    
    module "api_methods_cors" {
      source = "../aws/api_gateway/api_gateway_resource/api_gateway_method"
    
      api_id                  = var.api_id
      resource_id             = module.api_resource.resource_id
      http_method             = "OPTIONS"
      type                    = "MOCK"
      
      response_templates = {
        "application/json" = "{\"statusCode\" : 200}"
      }
    
      method_response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = true,
        "method.response.header.Access-Control-Allow-Methods" = true,
        "method.response.header.Access-Control-Allow-Headers" = true
      }
    
      integration_response_parameters = {
        "method.response.header.Access-Control-Allow-Origin"  = "'*'", 
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
      }
    
      depends_on = [ module.api_resource ]
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707780264344/d70733a9-9fd6-4ce9-8943-2ca27e820373.png)
    
* Save the file
    

### variables.tf

* Input the following to define the input variables for this module
    
    ```plaintext
    variable "api_id" {
      description = "(Required) ID of the associated REST API"
      type = string
      nullable = false
    }
    
    variable "parent_id" {
      description = "(Required) ID of the parent API resource"
      type = string
      nullable = false
    }
    
    variable "path_part" {
      description = "(Required) Last path segment of this API resource."
      type = string
      nullable = false
    }
    
    variable "http_method" {
      description = "(Required) HTTP Method (GET, POST, PUT, DELETE, HEAD, OPTIONS, ANY)"
      type = string
      default = "POST"
    }
    
    variable "lambda_function" {
      description = "Invoke ARN of Lambda Function for Integration with API Gateway"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707780287568/0a3d9a9a-6072-4807-8730-479be1f12d7d.png)
    
* Save the file
    

### outputs.tf

* Input the following to define the return values for this module:
    
    ```plaintext
    output "api_resource" {
      description = "Output API Gateway Resource ID for use for API Gateway Deployment"
      value = module.api_resource.resource_id
    }
    
    output "method" {
      description = "Output API Gateway Resource Method for use for API Gateway Deployment"
      value = module.api_methods.method
    }
    
    output "integration" {
      description = "Output API Gateway Resource Integration Method for use for API Gateway Deployment"
      value = module.api_methods.integration
    }
    
    output "integration_response" {
      description = "ID for API Gateway integration response"
      value = module.api_methods.integration_response
    }
    
    output "path" {
      description = "Path value for API Gateway Resource"
      value = module.api_resource.path
    }
    ```
    
* Save the file
    

---

## Modifying lambda files

For the API Gateway to interact with your respective Lambda functions, you will need to provide the API Gateway with the InvokeFunction permissions. Locate your lambda folder in `./infra/modules/aws/`.

### main.tf

* Input the following to assign permissions to the Lambda function
    
    ```plaintext
    resource "aws_lambda_permission" "permission" {
      statement_id  = "AllowExecutionFromAPIGateway"
      action        = "lambda:InvokeFunction"
      function_name = var.function_name
      principal     = "apigateway.amazonaws.com"
      source_arn = var.api_gateway_arn
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707782855641/9e9b6539-91e8-4b6b-881f-ccc7897a7bb0.png)
    
* Save the file
    

### variables.tf

* Include the following input variable for the lambda module
    
    ```plaintext
    variable "api_gateway_arn" {
      description = "Source ARN for API Gateway"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707782990510/51992639-a187-49a8-8c8c-7cc789bb9855.png)
    
* Save the file
    

---

## Modify lambda\_function files

In this section, you will include the argument for the api\_gateway\_arn.

### main.tf

* Modify your main.tf to include the api\_gateway\_arn. Input the following:
    
    ```plaintext
    api_gateway_arn = var.api_gateway_arn
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707783141428/d0b74182-99f4-4d9b-ab62-9459102b15ad.png)
    
* Save the file
    

### variables.tf

* Input the following to define the api\_gateway\_arn variable
    
    ```plaintext
    variable "api_gateway_arn" {
      description = "Source ARN for API Gateway"
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707783209386/65e680d1-36e0-4473-9681-430ebdf6ccb7.png)
    
* Save the file
    

---

## Modify my\_portfolio files

In this section, you will update my\_portfolio module to include the creation of the API Gateway, API Gateway Resources, and API Gateway Methods.

### main.tf

* Input the following to create the API Gateway, and DynamoDB and SNS Resource/Methods:
    
    ```plaintext
    module "api" {
      source = "../aws/api_gateway"
    
      name        = var.api_name
      description = var.api_description
      types       = var.api_types
    }
    
    module "api_resource_dynamodb" {
      source = "../api_resource_with_CORS"
    
      api_id                    = module.api.id
      parent_id                 = module.api.root_resource_id
      path_part                 = var.dynamodb_path_part
      http_method               = var.http_method
      lambda_function           = module.lambda_dynamodb.invoke_arn
    }
    
    module "api_resource_sns" {
      source = "../api_resource_with_CORS"
    
      api_id                    = module.api.id
      parent_id                 = module.api.root_resource_id
      path_part                 = var.sns_path_part
      http_method               = var.http_method
      lambda_function           = module.lambda_sns.invoke_arn
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707785051253/267fee7d-a703-4384-a55d-f847d607a108.png)
    
* Modify your entry for `module.lambda_dynamodb` and `module.lambda_sns` to include the api\_gateway\_arn argument
    

#### dynamodb:

```plaintext
"${module.api.execution_arn}/*/POST${module.api_resource_dynamodb.path}"
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707783473439/8227effc-f9ba-47cf-8bf8-67cd10359b3b.png)

#### sns:

```plaintext
"${module.api.execution_arn}/*/POST${module.api_resource_sns.path}"
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707783537582/af770ef5-e98f-450b-b68b-068983c36ca9.png)

* Save the file
    

### variables.tf

* Input the following to define the input variables for the API Gateway resources
    
    ```plaintext
    variable "api_name" {
      description = "(Required) Name of the REST API. If importing an OpenAPI specification via the body argument, this corresponds to the info.title field. If the argument value is different than the OpenAPI value, the argument value will override the OpenAPI value."
      type = string
    }
    
    variable "api_description" {
      default = "(Optional) Description of the REST API. If importing an OpenAPI specification via the body argument, this corresponds to the info.description field. If the argument value is provided and is different than the OpenAPI value, the argument value will override the OpenAPI value."
      type = string
    }
    
    variable "api_types" {
      description = "(Required) List of endpoint types. This resource currently only supports managing a single value. Valid values: EDGE, REGIONAL or PRIVATE. If unspecified, defaults to EDGE. If set to PRIVATE recommend to set put_rest_api_mode = merge to not cause the endpoints and associated Route53 records to be deleted. Refer to the documentation for more information on the difference between edge-optimized and regional APIs."
      type = list(string)
    }
    
    variable "dynamodb_path_part" {
      description = "(Required) Last path segment of the DynamoDB API resource."
      type = string
    }
    
    variable "sns_path_part" {
      description = "(Required) Last path segment of the SNS API resource."
      type = string
    }
    
    variable "http_method" {
      description = "(Optional) Integration HTTP method (GET, POST, PUT, DELETE, HEAD, OPTIONs, ANY, PATCH) specifying how API Gateway will interact with the back end. Required if type is AWS, AWS_PROXY, HTTP or HTTP_PROXY. Not all methods are compatible with all AWS integrations. e.g., Lambda function can only be invoked via POST."
      type = string
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707784141893/ae6e6fd8-28da-4258-91b1-6afe1287df52.png)
    
* Save the file
    
* There is no requirement for any outputs for the API Gateway.
    

---

## Modify ./infra/main.tf

In this section, you will define the input variables to pass to the my\_portfolio module.

### main.tf

* Input the following to include the creation for the API Gateway resources for the DynamoDB and SNS Lambda functions
    
    ```plaintext
    # API Gateway
      api_name = "My_REST_API"
      api_description = "This is a REST API for my portfolio"
      api_types = ["REGIONAL"]
      dynamodb_path_part = "viewers"
      sns_path_part = "emailme"
      http_method = "POST"
    ```
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707784307073/5a7c892f-4ea1-41f9-ad5d-64534c45221b.png)

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
git commit -m "Updated lambda permissions for API Gateway execution. Created API Gateway, resources and methods for 
SNS and DynamoDB"
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

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707785181328/a59a84fa-778d-4488-8b0a-020fa40af8e1.png)

> If you are using the same site files from the original template, the plan to add 21 should match.

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
    
* In the Search bar, search for "API Gateway" &gt; Select APIs
    
* You should see your API listed
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707785382863/803d01fa-8fa2-4b69-971c-10dfd242ad6f.png)
    
* Select your API
    
* Under the resources, you should see your defined resources `emailme` and `viewers`. Both resources should have a POST method and OPTIONS method listed
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707785488649/9419eed3-9265-43e1-bb23-5173790fe205.png)
    

---

## Testing API Gateway with Lambda

In this section, you will test your API Gateway resources and the Lambda functions associated with them.

### viewers

* Select the `/viewers POST` method
    
* Select the Test tab
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707785652571/b3a9f5e0-872d-4281-b1f8-3a77ffe0a325.png)
    
* Leave the fields blank, and select the Test button at the bottom
    
* You should receive output like below once completed
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707785729210/8a4f5080-02c8-467a-87ca-2f8299166092.png)
    
    > Note the views value from DynamoDB has incremented by 1 since the last test.
    
* This shows a successful integration for this resource using the Lambda function associated with updating the DynamoDB table
    

### emailme

* Select the `/emailme POST` method
    
* Select the Test tab
    
* In the Request body field, input the following:
    

```plaintext
{
    "name": "King T'challa",
    "email": "blackpanther@wakanda.com",
    "phone": 11111111,
    "subject": "Wakanda Forever!",
    "body": "For Honor, For Legacy, For Wakanda!"
}
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707787508171/9f4436f4-01c9-4b35-b120-13771c214af0.png)

* Select the Test button at the bottom
    
* You should receive output like below once completed
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707787577387/74da802a-018b-4b4e-b2bb-df23bb05e74f.png)

* Check your email. If successfully implemented, you should receive an email like below:
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707787626761/9ead2940-c1f1-446e-9f2d-5946d11fe306.png)

---

You have successfully implemented your API Gateway to interact with your Lambda functions. In the next module, you will modify your HTML and JavaScript files so that they will integrate the API Gateway resources. Due to CloudFront having cached files of your Static S3 Bucket website, you will need to invalidate the CloudFront Distribution. To do this, you will also modify your GitHub Actions to include invalidating CloudFront whenever your Public Folder files are modified.

[Next Module](./step_10.md)