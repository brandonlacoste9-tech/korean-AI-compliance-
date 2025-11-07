from setuptools import setup, find_packages

setup(
    name="korean-ai-compliance-backend",
    version="1.0.0",
    description="Korean AI Basic Act Compliance SaaS - FastAPI Backend",
    author="AI Compliance Guardian",
    packages=find_packages(),
    python_requires=">=3.10",
    install_requires=[
        "fastapi>=0.104.0",
        "uvicorn[standard]>=0.24.0",
        "sqlmodel>=0.0.14",
        "python-dotenv>=1.0.0",
        "pydantic>=2.5.0",
        "requests>=2.31.0",
        "python-multipart>=0.0.6",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
        ]
    },
    entry_points={
        "console_scripts": [
            "start-server=app.main:main",
        ],
    },
)
