import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import _ from 'lodash';

const useCustomLoader = ({
  fetchFunction,
  isFetchOnLoad = false,
  initialParams = null,
}) => {
  const [param, setParam] = useState(initialParams);

  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['customLoader', param],
    queryFn: () => fetchFunction(param),
    enabled: isFetchOnLoad || !!param,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isFetchOnLoad && param === null) {
      fetch();
    }
  }, [isFetchOnLoad, param]);

  const fetch = useCallback((props) => {
    if (_.isEqual(props, param)) {
      refetch();
    } else {
      setParam(props);
    }
  }, [param, refetch]);

  const reFetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    data: data || null,
    errorMessage: error ? error.errorMessage : null,
    loading: isLoading,
    error: !!error,
    fetch,
    reFetch,
  };
};

export default useCustomLoader;
