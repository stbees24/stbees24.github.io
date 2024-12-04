import { Header, type User } from "./Header"

export interface SbsHeaderProps {
    user?: User;
    onLogin?: () => void;
    onLogout?: () => void;
    onCreateAccount?: () => void;
}


export const SbsHeader = ({ user, onLogin, onLogout, onCreateAccount }: SbsHeaderProps) => (
    <>
	<Header title="BEES ENTRY" user={user} onLogin={onLogin} onLogout={onLogout} onCreateAccount={onCreateAccount}  />
    </>
)


