import React, { memo, Suspense, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routeConfig } from 'shared/config/routeConfig/routeConfig';
import { PageLoader } from 'widgets/PageLoader';
import { useSelector } from 'react-redux';
import { getUserAuthData } from 'entities/User';

const AppRouter = () => {
    const isAuth = useSelector(getUserAuthData);

    const routes = useMemo(() => {
        return Object.values(routeConfig)
            .filter((route) => {
                if (route.authOnly && !isAuth) {
                    return false;
                }
                return true;
            })
            .map(({ element, path }) => (
                <Route
                    key={path}
                    path={path}
                    element={<div className="page-wrapper">{element}</div>}
                />
            ));
    }, [isAuth]);

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>{routes}</Routes>
        </Suspense>
    );
};

export default memo(AppRouter);
