"""SubGuard Core Configuration."""

from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "SubGuard AI"
    environment: str = "production"
    port: int = 8000
    host: str = "0.0.0.0"

    # Default Deterministic Constraints
    default_monthly_budget_ceiling: float = 500.00
    default_autonomous_single_limit: float = 50.00
    default_auto_cancellation_lead_days: int = 2

    # Database
    database_url: str = "postgresql://subguard:subguard_secret@localhost:5432/subguard_db"

    # Webhooks
    zapier_webhook_url: str = "https://hooks.zapier.com/hooks/catch/subguard/approval"


settings = Settings()
