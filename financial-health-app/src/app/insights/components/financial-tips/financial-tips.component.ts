import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsightService } from '../../../core/services/insight.service';
import { InsightResponseDto } from '../../../models/dto/insight.response.dto';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-financial-tips',
  templateUrl: './financial-tips.component.html',
  styleUrls: ['./financial-tips.component.scss']
})
export class FinancialTipsComponent implements OnInit {
  tipQueryForm: FormGroup;
  isLoading: boolean = false;
  advice: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private insightService: InsightService
  ) {
    this.tipQueryForm = this.fb.group({
      userQuery: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.tipQueryForm.invalid) {
      this.tipQueryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.advice = null;
    this.errorMessage = null;
    const query = this.tipQueryForm.value.userQuery;

    this.insightService.generateInsight(query).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: InsightResponseDto) => {
        this.advice = response.adviceText;
      },
      error: (err) => {
        console.error('Error fetching financial tip:', err);
        this.errorMessage = 'Sorry, we could not fetch a tip at this moment. Please try again later.';
      }
    });
  }

  get f() { return this.tipQueryForm.controls; }
}
