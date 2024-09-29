export interface Student {
    _id: {
        $oid: string; 
    };
    neptun: string;
    key: string; 
    name: string;
    semester: number;
    admission_unit: string;
    dormitory_order: string[];
    previously_denied: boolean;
    social_quota_admission: boolean;
    address: string | null;
    accepted: boolean | null;
    distance: number;
    score: number;
}
