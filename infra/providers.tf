terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.31.0"
    }

  }
  cloud {
    organization = "INPUT_ORG_HERE"

    workspaces {
      name = "INPUT_WORKSPACE_HERE"
    }
  }
}

provider "aws" {
  region = "INPUT_AWS_REGION_HERE"
}