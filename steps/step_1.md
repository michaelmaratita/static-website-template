#  Introduction

Late last year, I completed a Terraform boot camp hosted by [ExamPro](https://www.exampro.co/). I was exposed to the capabilities of Infrastructure as Code (IaC) and how I can leverage it to create complex systems. I also connected with some folks who inspired me to take on this challenge.

* My Brother - [Jonas Maratita](https://resume.maratita.link/)
    
* [Estaban Moreno](https://estebanmoreno.link)
    

In this series, I will showcase the Cloud Resume Challenge how I tackled it, and step-by-step instructions so that anyone else can use the same to complete their very own resume challenge of their own. We will focus primarily on IaC deployments, but will walk-through validations through the console for visualization.

I will explain everything in detail to mitigate any confusion for anyone new to IT, or these specific services. I will also show how you can test your code to ensure functionality.

---

## Architecture Diagram

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1705609580769/890b8d80-d051-40ed-8a8a-1f9f4b178913.png)

Select the Architecture Diagram to gain better insight into the final state of this project. I have a template repo that you can access [here](https://github.com/michaelmaratita/sample-cloud-resume), or you can follow along with the modules to gain insights into the deployment.

The first thing we will accomplish is implementing our CI/CD pipeline for our infrastructure and configuring Terraform Cloud. This will negate the requirement to run `terraform apply` each time a resource is added or modified. GitHub Actions will take care of all of the legwork for us. You'll be able to see what will be deployed, `(terraform plan)`, whenever Pull Requests are made. Once the Pull Request has been approved and merged, another GitHub Actions workflow will apply any infrastructure or site changes and invalidate the CloudFront Distribution to update the content viewers see.

You will then create each resource in the steps outlined in the tasks section below. Once each module is complete, you will push your configurations to your GitHub repo and watch the automation work seamlessly!

---

### Tasks:

* Implement GitHub Actions / Prepare Terraform Cloud
    
* Create S3 Bucket (Blocking Public Access)
    
* Upload files to an S3 bucket, e.g. HTML, CSS, JavaScript, images, etc.
    
* Create a CloudFront Distribution
    
* Create a DynamoDB Table for viewer count
    
* Create an SNS Subscription to send Emails from a Contact Form
    
* Create Lambda Functions for SNS and DynamoDB
    
* Create an API Gateway
    
* Create Route53 Records for CloudFront Distribution
    

---

## Getting Started:

Before you can get started with creating resources or writing code, there are a few considerations you need to complete.

* [**Create an AWS Account**](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html)
    
    * create a user account with programmatic access with Administrative Access
        
    * create a user account for your GitHub actions secrets with Administrative Access
        
    * See [aws configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) to properly configure your credentials with your access key and secret key.
        
* [**Create a GitHub Account**](https://docs.github.com/en/get-started/quickstart/creating-an-account-on-github)
    
    * create a repository utilizing my template
        
* [**Create a Terraform Cloud Account**](https://app.terraform.io/public/signup/account)
    
    * create a Project and Workspace
        
* Install Integrated Development Environment (IDE): I use **Visual Studio Code** for Windows
    

[Let's get started!](./step_2.md)