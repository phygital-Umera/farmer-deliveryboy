import {Outlet} from '@tanstack/react-router';
// import {TanStackRouterDevtools} from '@tanstack/router-devtools';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-[#fcf9f8] w-full">
      <Outlet />
      {/* <TanStackRouterDevtools initialIsOpen={false} /> */}
    </div>
  );
};

export default RootLayout;
