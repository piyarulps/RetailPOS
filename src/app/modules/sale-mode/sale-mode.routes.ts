import { Route } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { TerminalComponent } from './terminal/terminal.component';

export const SaleModeRoutes: Route[] = [
    {
        path: "terminal",
        component: TerminalComponent,
        data: {
            moduleName: 'myTerminal'
        },
        canActivate: [AuthGuard]
    }
]