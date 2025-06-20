import { Component, Input } from '@angular/core';
// LucideAngularModule is not directly imported here if the component is part of SharedModule,
// which itself imports LucideAngularModule. The component's template will have access to <lucide-icon>.

@Component({
  selector: 'app-lucide-icon',
  templateUrl: './lucide-icon.component.html',
  styleUrls: ['./lucide-icon.component.scss']
  // This component is declared in SharedModule, so not standalone.
})
export class LucideIconComponent {
  @Input() name: string = 'activity';
  @Input() class: string = '';
  @Input() size: string = '24';
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: string = '2';

  constructor() {}
}
