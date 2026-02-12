import { type Base } from '../../../common';

interface ContactInfo {
    value: string;
    primary: boolean;
}

interface Location {
    country: string;
    city: string;
}


export interface Customer extends Base {
    name: string;
    displayName: string;
    locale: string;
    phones: ContactInfo[];
    location: Location;
    userId: string;
    workspaceId: string;
    emails: ContactInfo[];

}
