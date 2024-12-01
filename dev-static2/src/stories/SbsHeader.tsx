import React from 'react'
import {  Header, type User } from "./Header"


export interface SbsHeaderProps {
    user?: User;
    onLogin?: () => void;
    onLogout?: () => void;
    onCreateAccount?: () => void;
}


export const SbsHeader = ({ user, onLogin, onLogout, onCreateAccount }: SbsHeaderProps) => (
    <>
	<Header title="ST BEES" user={user} onLogin={onLogin} onLogout={onLogout} onCreateAccount={onCreateAccount}  />
    </>
)


