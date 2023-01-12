declare global {
    namespace Express {
        interface Request {
            user:{
                    id: string;
                    username: string;
                    isAdmin: boolean;
                }
            
        }
    }
}
export {};