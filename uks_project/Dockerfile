# Use the official Python image as the base
FROM python:3.9


# Set the working directory in the container
WORKDIR /backend

# Copy requirements.txt to the container
COPY ./requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the entire backend directory to the container
COPY . .

# Expose port 8000
EXPOSE 8000