# GitHub and GitHub Actions

To get started within this module, you will be creating a GitHub repo from the template repo. Then you will prepare your Terraform Cloud environment with some configurations in preparation for creating your AWS infrastructure.

Let's get started!

---

## Cloning Template Repository

* Login to GitHub
    
* Go to [**my template**](https://github.com/michaelmaratita/static-website-template) &gt; Select **Use this template** &gt; Select **Create a new repository**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706570195564/caf56e5d-ee96-4a8f-945c-5a42414da717.png align="center")

* Input a Repo name and Description
    
* Select **Create repository**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706570414531/a4a9c391-f6cc-469f-8297-0050f3024bf3.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706570452034/666d749c-2ca9-4da1-9a3e-2c4a006eb242.png align="center")

---

## Cloning your repo

* In your IDE terminal, clone your repository.
    

```plaintext
git clone https://github.com/YOUR_REPOSITORY.git PATH_TO_SAVE_LOCATION
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706570621634/f3e1bf1d-d11e-4e46-9d00-e14eb9cdea6b.png align="center")

* Open the folder from your cloned repo
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706570668623/bf23c099-5134-4621-9f23-5ceb77d9cefc.png align="center")

---

## Create a New Branch in your repo

* In GitHub, select **Issues** &gt; **New Issue**
    
* Enter a title for your issue, e.g. Modify GitHub Actions
    
* Enter a description if you'd like
    
* Select **Submit new issue**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706570893012/91adb22a-5c3c-47e7-81ba-69093af327d1.png align="center")

* On the right hand pane, under Development, select **Create a branch**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706570999463/6350cc7c-4efe-4ca3-8392-76f21c55ae8c.png align="center")

* Leave the defaults and select **Create branch**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706571033159/82aa7346-b759-4e21-b93e-fcfdaa6d92c7.png align="center")

* Open your IDE Terminal.
    
* Input the following:
    

```plaintext
git fetch origin
```

```plaintext
git checkout YOUR_BRANCH_NAME
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706571606181/11e59ff1-88cb-4308-a48e-a1108b558b2d.png align="center")

---

## Configure Terraform Cloud

* Login to [Terraform](https://www.terraform.io/)
    
* Select **Projects & workspaces** &gt; Select **New** &gt; **Project**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706074290089/af749653-107e-4409-ba91-ded95f75403d.png align="center")

* Input your Project Name
    
* Select **New** &gt; **Workspace**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706074427636/d41d2477-5645-4b46-8114-ea2a701ffabf.png align="center")

* Select **API-Driven Workflow**
    
* Input your Workspace Name
    
* Select the Project you created from the drop-down
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706074518209/4cd67696-1768-4f04-9d63-778c12a0266f.png align="center")

* Select **Create**
    

You will be taken to the Overview page for this workspace. You will see some Example code on this page with your organization and workspace name.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706074907466/cfee99bd-f069-474f-b2c5-7f0b55a74b56.png align="center")

> **Take note of these.**

* On the left pane, Select **Settings**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706075192459/eae3473e-7f5d-4102-a397-0a6b682e011b.png align="center")

* Under the General section, scroll down and find the **Terraform Working Directory**
    

```plaintext
./infra
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706075349662/5a173c64-81ab-499a-bf95-a94dec2bfba2.png align="center")

* **Save your change at the bottom**
    

---

## Creating Variables

* Go back to the Overview page, select **Variables**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706107764751/ffa8f293-d204-417a-ac68-9ec6a86dc4da.png align="center")

* Create the following variables:
    
    * **AWS\_ACCESS\_KEY\_ID** - Select the Sensitive dialog box
        
        * Select Add variable
            
    * **AWS\_SECRET\_ACCESS\_KEY** - Select the Sensitive dialog box
        
        * Select Add variable
            

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706108118361/db568560-038e-4d64-b5af-180b81b5d7f7.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706108229303/3f303799-63d9-4851-84dc-24094ea8d9f7.png align="center")

---

## Creating Terraform API Token

* At the top of the left pane, select your profile drop-down &gt; Select **Account Settings**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706075564108/2a2b5996-5767-4785-8dc0-919e89e60602.png align="center")

* Under **Account Settings**, Select **Tokens**
    
* Select **Create an API Token**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706075680788/0ec0a088-9288-4edf-a1fb-82f457ed4e0d.png align="center")

* Enter a name/description of the token and set an expiration date for it
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706075751529/fbe0116c-0f86-4a61-818c-9ae3b0691cf1.png align="center")

* Select **Generate Token**
    

> Take note of the output from the token. You will need this for your GitHub Secrets

---

## Add GitHub Secrets

* Go back to GitHub
    
* Select your repo for this project
    
* Select **Settings** on the top right
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706108949919/97f82a1c-f5a3-490c-9a67-4f1a52b90734.png align="center")

* On the left pane under Security, Select **Secrets and variables** &gt; **Actions**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706109087487/e1aefcab-5e18-4311-a8ab-e11cdc015ed0.png align="center")

* Select **New repository secret**
    
* Create the following Secrets:
    
    * **AWS\_ACCESS\_KEY\_ID** - same information as the Terraform Cloud Variable.
        
    * **AWS\_SECRET\_ACCESS\_KEY** - same information as the Terraform Cloud Variable.
        
    * **TF\_API\_TOKEN** - output from Terraform Cloud API Token.
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706109426683/2ad8b3f3-2f06-4ead-b5e5-5cef42d00375.png align="center")

> NOTE: AWS\_ACCESS\_KEY\_ID and AWS\_SECRET\_ACCESS\_KEY will be utilized later for CloudFront invalidations.

---

## Update .yml files

* Open your IDE
    
* Update your `terraform-plan.yml` and `terraform-apply_cloudfront-invalidation.yml` files to reflect your Organization and Workspace.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706571745035/c4ceeada-d479-49ed-8036-d54978fd083e.png align="center")

* Save your files
    

---

## Update ./infra/providers.tf

* Update your providers.tf to include your organization, workspace and AWS region.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706586904730/a3b980ec-4a11-4656-86c0-9ce16df95ac9.png align="center")

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

git commit -m "updated .yml files with terraform organization and workspace."
```

> Commit the changes with a comment.

```plaintext
git push
```

> Push to GitHub.

---

### Create Pull Request

* Go to GitHub
    
* You should see the push on your repository
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706572196639/99afb40f-0d8d-4cf3-ba32-3b1979f07c18.png align="center")

* Select **Compare & pull request**
    
* Validate the changes that were made to be pushed to `main`
    
* Select **Create pull request**
    
* Select **Merge pull request**
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1706110798445/1e50eb90-2018-4f4f-a8ac-0a6cf87572f8.png align="center")

* **Confirm merge**
    
* **Delete Branch**
    
* In your IDE Terminal, input the following:
    

```plaintext
git checkout main
```

> This will checkout main and swap out of your branch

```plaintext
git pull
```

> This will pull the configuration from GitHub so that main is in sync

---

In the next module, you modify some of your terraform files to create an Amazon S3 Bucket. You'll also make modifications again to your GitHub workflow so that your resources will be created automatically.

[Next Module](./step_3.md)