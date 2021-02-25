import React from 'react';

import Layout from './layout';
import Unathorized from './unauthorized';

interface AuthGuardProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  pagination?: React.ReactNode;
}

export default function AuthGuard({ isAuthenticated, children, pagination }: AuthGuardProps) {
  return (
    <>
      <Layout>{isAuthenticated ? children : <Unathorized />}</Layout>
      {isAuthenticated && pagination}
    </>
  );
}
