import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale/fr';

class CustomAdapterDateFns extends AdapterDateFns {
    constructor() {
        super({ locale: fr });
    }
}

export default CustomAdapterDateFns;
