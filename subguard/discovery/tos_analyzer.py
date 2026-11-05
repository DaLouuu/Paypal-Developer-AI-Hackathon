"""
Terms of Service (ToS) Dark-Pattern Analyzer for SubGuard AI.
Analyzes vendor legal contract clauses for auto-renewal lock-ins,
mandatory phone cancellation friction, excessive advance notice requirements,
and early termination penalties.
"""

from typing import List, Optional
import re
from pydantic import BaseModel, Field


class ToSAnalysisResult(BaseModel):
    vendor_domain: str
    tos_risk_score: float = Field(ge=0.0, le=1.0)
    has_auto_renewal_trap: bool = False
    requires_phone_cancellation: bool = False
    notice_lead_days_required: int = 0
    has_early_termination_penalty: bool = False
    dark_pattern_warnings: List[str] = Field(default_factory=list)


class ToSAnalyzer:
    def __init__(self):
        # Regex patterns for deceptive or restrictive clauses
        self.phone_cancellation_patterns = [
            re.compile(r"contact.*telephone|via telephone|phone call|call.*retention|call customer service", re.IGNORECASE),
            re.compile(r"cannot be performed via.*(website|settings|portal|app)", re.IGNORECASE),
            re.compile(r"1-\d{3}-\d{3}-\d{4}", re.IGNORECASE)
        ]
        self.auto_renewal_patterns = [
            re.compile(r"automatically (convert|renew|charge)|automatic renewal|irrevocable authorization", re.IGNORECASE),
            re.compile(r"converts? into (an? )?annual|subsequent 12-month", re.IGNORECASE)
        ]
        self.notice_period_patterns = [
            re.compile(r"\((\d+)\)\s*(days?|day)\s*(advance|prior)?\s*(written )?notice", re.IGNORECASE),
            re.compile(r"(\d+)\s*(days?|days'|day)\s*(advance|prior)?\s*(written )?notice", re.IGNORECASE),
            re.compile(r"notice (at least )?(\w+ )?\(?(\d+)\)?\s*days", re.IGNORECASE),
            re.compile(r"cancelled (at least )?(\w+ )?\(?(\d+)\)?\s*days prior", re.IGNORECASE)
        ]
        self.penalty_patterns = [
            re.compile(r"early termination (penalty|fee)|non-refundable.*penalty|\d+%\s*early termination", re.IGNORECASE)
        ]
        self.consumer_friendly_patterns = [
            re.compile(r"cancel.*any time.*single click|directly through your account dashboard", re.IGNORECASE),
            re.compile(r"card will never be charged|no advance notice is required|full refunds are provided", re.IGNORECASE)
        ]

    def analyze_tos_text(self, contract_text: str, vendor_domain: str = "vendor.com") -> ToSAnalysisResult:
        """Evaluates contract text and calculates risk score between 0.0 and 1.0."""
        text = contract_text.strip()
        warnings: List[str] = []
        score = 0.0

        # Check for transparent, consumer-friendly clauses
        is_friendly = any(p.search(text) for p in self.consumer_friendly_patterns)

        # 1. Phone Cancellation Friction (High Risk: +0.40)
        requires_phone = False
        for p in self.phone_cancellation_patterns:
            if p.search(text):
                requires_phone = True
                warnings.append("Mandatory phone call required for cancellation")
                score += 0.40
                break

        # 2. Auto-Renewal Traps (Moderate-High Risk: +0.30)
        has_auto_renewal = False
        for p in self.auto_renewal_patterns:
            if p.search(text):
                has_auto_renewal = True
                warnings.append("Automatic contract renewal conversion detected")
                score += 0.30
                break

        # 3. Notice Period Extraction
        notice_days = 0
        for p in self.notice_period_patterns:
            match = p.search(text)
            if match:
                groups = match.groups()
                for g in groups:
                    if g and g.isdigit():
                        notice_days = int(g)
                        break
                if notice_days > 0:
                    break

        if notice_days >= 60:
            score += 0.25
            warnings.append(f"Excessive advance cancellation notice required ({notice_days} days)")
        elif notice_days >= 30:
            score += 0.15
            warnings.append(f"Advance cancellation notice required ({notice_days} days)")

        # 4. Termination Penalties
        has_penalty = False
        for p in self.penalty_patterns:
            if p.search(text):
                has_penalty = True
                warnings.append("Early termination penalty fee assessed on cancellation")
                score += 0.15
                break

        # If friendly clauses exist and no deceptive patterns, lower score
        if is_friendly and not requires_phone and notice_days == 0:
            score = max(0.05, score * 0.2)
            warnings = []

        # Clamp between 0.0 and 1.0
        final_score = min(1.0, max(0.0, score))

        return ToSAnalysisResult(
            vendor_domain=vendor_domain,
            tos_risk_score=round(final_score, 2),
            has_auto_renewal_trap=has_auto_renewal,
            requires_phone_cancellation=requires_phone,
            notice_lead_days_required=notice_days,
            has_early_termination_penalty=has_penalty,
            dark_pattern_warnings=warnings
        )
