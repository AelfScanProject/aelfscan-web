import { useRouter } from 'next/navigation';

export const useUpdateQueryParams = () => {
  const router = useRouter();

  const updateQueryParams = (params) => {
    const currentUrl = new URL(window.location.href);
    const newSearchParams = new URLSearchParams(currentUrl.search);

    Object.keys(params).forEach((key) => {
      newSearchParams.set(key, params[key]);
    });

    // Construct the new URL with updated query params and hash
    const newUrl = `${currentUrl.pathname}?${newSearchParams.toString()}`;

    // Use Next.js router to replace the state
    if (newUrl !== window.location.href) {
      router.replace(newUrl, { scroll: false });
    }
  };

  return updateQueryParams;
};
export const useDeleteQueryParam = () => {
  const router = useRouter();
  const deleteQueryParam = (params: string[], updateData?: any) => {
    const currentUrl = new URL(window.location.href);
    const newSearchParams = new URLSearchParams(currentUrl.search);
    console.log(newSearchParams, 'newSearchParams');
    params.forEach((item) => {
      console.log(newSearchParams.get(item), 'newSearchParams.get(item)');
      if (newSearchParams.get(item)) {
        newSearchParams.delete(item);
      }
    });
    if (updateData) {
      Object.keys(updateData).forEach((key) => {
        newSearchParams.set(key, updateData[key]);
      });
    }

    console.log(`${currentUrl.pathname}?${newSearchParams.toString()}`, 'newSearchParams.toString()');

    // Construct the new URL with updated query params and hash
    const newUrl = `${currentUrl.pathname}?${newSearchParams.toString()}`;

    // Use Next.js router to replace the state
    if (newUrl !== window.location.href) {
      router.replace(newUrl, { scroll: false });
    }
  };

  return deleteQueryParam;
};
