
# # Configure the AWS Provider
# provider "aws" {
#   region = "eu-north-1"
# }



# resource "aws_security_group" "movie_sg" {
#   name = "movie_sg"

#   ingress {
#     description = "Allow Inbound HTTP"
#     from_port   = 80
#     to_port     = 80
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     description = "Allow Inbound HTTPS"
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     description = "Allow SSH"
#     from_port   = 22
#     to_port     = 22
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     description = "Allow app"
#     from_port   = 4000
#     to_port     = 4000
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "movie-sg"
#   }

# }

# resource "aws_instance" "movie" {
#   ami           = "ami-0705384c0b33c194c"
#   instance_type = "t3.micro"
#   tags = {
#     Name = "movie"
#   }
#   vpc_security_group_ids = [aws_security_group.movie_sg.id]

#   key_name = "movie"

# }
