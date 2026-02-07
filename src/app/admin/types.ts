
// This file can provide types if needed, or we can just ensure the page component has correct props
export type PageProps = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};
