provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "Monad_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "Monad-vpc"
  }
}

resource "aws_subnet" "Monad_subnet" {
  vpc_id            = aws_vpc.Monad_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "Monad-subnet"
  }
}

resource "aws_security_group" "Monad_sg" {
  vpc_id = aws_vpc.Monad_vpc.id

  ingress {
    from_port   = 9650
    to_port     = 9650
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 9651
    to_port     = 9651
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Monad-sg"
  }
}

resource "aws_instance" "Monad_validator" {
  ami           = "ami-0c55b159cbfafe1f0" # Replace with a valid AMI ID
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.Monad_subnet.id
  security_groups = [aws_security_group.Monad_sg.name]

  tags = {
    Name = "Monad-validator"
  }
}