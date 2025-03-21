import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState, useTransition} from 'react';
import {
  SearchDropdownBoxModalProps,
  SearchDropdownBoxModalRenderOptionsProps,
} from '../@types/modals';
import {cancelApi} from '../Utilities/GeneralUtilities';
import HOCView from '../Components/HOCView';
import StyledText from '../Components/StyledText';
import {COLORS, BOX_SHADOW} from '../Utilities/Constants';
import Loader from '../Components/Loader';
import TextInputBox from '../Components/TextInputBox';
import {UseToken} from '../Utilities/StoreData';
import {
  AssignedUserDropdownListService,
  getDivisionDropdownListService,
  getMachineDropdownListService,
  getRoleDropdownListService,
  getTasksListService,
  getUserDropdownListService,
  getWorkCenterDropdownListService,
  MaterialDropdownListService,
} from '../Services/Services';
import Toast from '../Components/Toast';
import {
  AssignedUserLtemProps,
  MachineDropdownListApiResponseProps,
  RoleItemProps,
  TaskListProps,
} from '../@types/api';
import {ObjectType} from '../Components/types';
import {ConvertJSONtoFormData} from '../Utilities/Methods';

var isMount = true;
var currentPage = 1;
var totalPages = 1;

const SearchDropdownBoxModal = ({
  title = '',
  apiType,
  icon,
  isEndReached = false,
  isLocalSearch = false,
  isRefreshing = false,
  options = [],
  searchFieldName = '',
  onClose,
  onSelect,
  fieldName,
  multiSelect = false,
  value,
  uniqueKey,
  onMultipleSelect,
  apiFilters,
}: SearchDropdownBoxModalProps) => {
  const token = UseToken();
  const isScrollBeginRef = useRef<boolean>(true);
  const globalDataList = useRef<any[]>([...options]);
  let controller = useRef<AbortController | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchText, setsearchText] = useState<string>('');
  const [optionsList, setoptionsList] = useState<any[]>([...options]);
  const [isEndRefreshing, setisEndReached] = useState<boolean>(false);
  const [isRefresh, setisRefresh] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState(
    multiSelect ? [...value] : value,
  );
  const [isListLoading, setisListLoading] = useState<boolean>(
    apiType ? true : false,
  );

  useEffect(() => {
    isMount = true;
    currentPage = 1;
    totalPages = 1;

    handleGetOptionsList();

    return () => {
      currentPage = 1;
      totalPages = 1;

      isMount = false;
      cancelApi(controller.current);
    };
  }, []);

  const handleGetOptionsList = (page: number = 1, search_text: string = '') => {
    switch (apiType) {
      case 'machineList':
        handleGetMachineList();
        break;
      case 'user':
        handleGetUserList();
        break;
      case 'work_center':
        handleGetWorkCenterList();
        break;
      case 'division':
        handleGetDivisionList();
        break;
      case 'roleList':
        handleRoleList();
        break;
      case 'assignedUsersList':
        handleAssignedUserList();
        break;
      case 'MaterialList':
        handlegetMaterialList();
        break;
      case 'TaskList':
        handlegetTaskList(page);
      default:
        break;
    }
  };

  const handlegetTaskList = (page = 1) => {
    let finalObj = {token, ...(apiFilters || {})};

    getTasksListService(ConvertJSONtoFormData(finalObj), page)
      .then(res => {
        const response = res.data;

        if (response.status === 1) {
          if (isMount) {
            let finalList = response?.data?.items?.map(
              (item: TaskListProps) => ({
                ...item,
                unique_id: item?.task_id,
              }),
            );
            setoptionsList(finalList || []);
            globalDataList.current = finalList || [];
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
        }
      });
  };

  const handlegetMaterialList = () => {
    const formData = new FormData();
    formData.append('token', token);
    MaterialDropdownListService(formData)
      .then(res => {
        const response = res.data;

        if (response.status === 1) {
          if (isMount) {
            let finalList = response?.data?.map(
              (item: AssignedUserLtemProps) => ({
                ...item,
                unique_id: item?.user_id,
              }),
            );
            setoptionsList(finalList || []);
            globalDataList.current = finalList || [];
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
        }
      });
  };
  const handleAssignedUserList = () => {
    const formData = new FormData();
    formData.append('token', token);
    AssignedUserDropdownListService(formData)
      .then(res => {
        const response = res.data;

        if (response.status === 1) {
          if (isMount) {
            let finalList = response?.data?.map(
              (item: AssignedUserLtemProps) => ({
                ...item,
                unique_id: item?.user_id,
              }),
            );
            setoptionsList(finalList || []);
            globalDataList.current = finalList || [];
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
        }
      });
  };
  const handleRoleList = () => {
    const formData = new FormData();
    formData.append('token', token);
    getRoleDropdownListService(formData)
      .then(res => {
        const response = res.data;

        if (response.status === 1) {
          if (isMount) {
            let finalList = response?.data?.map((item: RoleItemProps) => ({
              ...item,
              unique_id: item?.role_id,
            }));
            setoptionsList(finalList || []);
            globalDataList.current = finalList || [];
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
        }
      });
  };

  const handleGetDivisionList = () => {
    const formData = new FormData();
    formData.append('token', token);
    // formData.append('type', 4);
    getDivisionDropdownListService(formData)
      .then(res => {
        const response = res.data;
        if (response.status === 1) {
          if (isMount) {
            setoptionsList(response.data || []);
            globalDataList.current = response.data || [];
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
        }
      });
  };

  const handleGetWorkCenterList = () => {
    const formData = new FormData();
    formData.append('token', token);
    // formData.append('type', 4);
    getWorkCenterDropdownListService(formData)
      .then(res => {
        const response = res.data;
        if (response.status === 1) {
          if (isMount) {
            setoptionsList(response.data || []);
            globalDataList.current = response.data || [];
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
        }
      });
  };

  const handleGetUserList = () => {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('usertype', 4);
    getUserDropdownListService(formData)
      .then(res => {
        const response = res.data;
        if (response.status === 1) {
          if (isMount) {
            setoptionsList(response.data || []);
            globalDataList.current = response.data || [];
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
        }
      });
  };

  const handleGetMachineList = () => {
    const formData = new FormData();
    formData.append('token', token);

    getMachineDropdownListService(formData)
      .then(res => {
        const response = res.data;
        if (response.status === 1) {
          if (isMount) {
            setoptionsList([...response?.data]);
            globalDataList.current = [...response?.data];
          }
        } else if (response.status === 0) {
          Toast.error(response.msg);
        }
      })
      .catch(err => {
        Toast.error(err.message);
      })
      .finally(() => {
        if (isMount) {
          setisListLoading(false);
        }
      });
  };

  const getList = () => {
    if (searchText && searchText.trim()) {
      if (searchFieldName) {
        return [...optionsList].filter(item =>
          item[searchFieldName]
            .toLowerCase()
            .includes(searchText.toLowerCase().trim()),
        );
      }
      return [...optionsList].filter(item =>
        item.toLowerCase().includes(searchText.toLowerCase().trim()),
      );
    }
    return [...globalDataList.current];
  };

  const onRefresh = () => {
    if (isMount) {
      setsearchText('');
      setisRefresh(true);
    }
    currentPage = 1;
    totalPages = 1;
    globalDataList.current = [];
    handleGetOptionsList(1);
  };

  const onEndReached = () => {
    if (currentPage <= totalPages) {
      if (isMount) setisEndReached(true);
      handleGetOptionsList(currentPage);
    }
  };

  const getIsListEmpty = () => {
    if (isLocalSearch) {
      return [...getList()].length === 0;
    }
    return [...optionsList].length === 0;
  };

  const renderOptions = ({
    item,
    index,
  }: SearchDropdownBoxModalRenderOptionsProps) => {
    const handleSelectItem = (item: any) => {
      if (multiSelect) {
        if (
          selectedValues?.find(
            (elem: ObjectType) =>
              elem?.[`${uniqueKey}`] === item?.[`${uniqueKey}`],
          )
        ) {
          setSelectedValues(
            selectedValues?.filter(
              (data: ObjectType) =>
                data?.[`${uniqueKey}`] !== item?.[`${uniqueKey}`],
            ),
          );
        } else {
          setSelectedValues((pre: any) => [...pre, item]);
        }
      } else {
        if (onSelect) onSelect(item);
        if (onClose) onClose();
      }
    };
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelectItem(item);
        }}
        style={{
          padding: 8,
          backgroundColor: multiSelect
            ? selectedValues?.some(
                (elem: ObjectType) =>
                  elem?.[`${uniqueKey}`] === item?.[`${uniqueKey}`],
              )
              ? COLORS.orange
              : COLORS.white
            : COLORS.white,
          marginVertical: 7,
          borderRadius: 8,
          ...BOX_SHADOW,
        }}>
        {/*@ts-ignore */}
        <StyledText>{item[fieldName]}</StyledText>
      </TouchableOpacity>
    );
  };

  const handleMultipleSelectedDatas = () => {
    if (onMultipleSelect) onMultipleSelect(selectedValues);

    if (onClose) onClose();
  };

  return (
    <HOCView
      headerTitle={`Select ${title}`}
      headerProps={{
        isEnableMenu: false,
        onBackPress() {
          if (onClose) onClose();
        },
        isRightIconEnable: false,
        isEnableTickIcon: multiSelect,
        onPressTickIcon: () => {
          handleMultipleSelectedDatas();
        },
      }}
      isShowSecondaryHeader={false}
      paddingVertical={5}
      paddingHorizontal={5}>
      <TextInputBox
        value={searchText}
        onChangeText={(val: string) => {
          startTransition(() => {
            if (isMount) {
              setsearchText(val);
              if (!isLocalSearch) {
                setisListLoading(true);
              }
              handleGetOptionsList(1, val);
            }
          });
        }}
        customInputBoxContainerStyle={{
          borderRadius: 50,
        }}
        textInputProps={{
          style: {
            borderRadius: 50,
            width: '100%',
            paddingHorizontal: 15,
            color: COLORS.black,
          },
        }}
        placeHolder="Search here"
      />
      <View style={styles.container}>
        {isListLoading ? (
          <Loader isVisible={true} backgroundColor={COLORS.backgroundColor} />
        ) : getIsListEmpty() ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <StyledText>No Data Found</StyledText>
          </View>
        ) : (
          <FlatList
            removeClippedSubviews={false}
            keyboardShouldPersistTaps="handled"
            data={isLocalSearch ? [...getList()] : [...optionsList]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderOptions}
            initialNumToRender={25}
            contentContainerStyle={{paddingHorizontal: 10}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  if (onRefresh) onRefresh();
                }}
              />
            }
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              if (!isScrollBeginRef.current && onEndReached) {
                isScrollBeginRef.current = true;
                onEndReached();
              }
            }}
            onMomentumScrollBegin={() => {
              isScrollBeginRef.current = false;
            }}
            ListFooterComponent={() => {
              return isEndReached ? (
                <View style={{width: '100%'}}>
                  <ActivityIndicator size={'small'} color={COLORS.primary} />
                </View>
              ) : null;
            }}
          />
        )}
      </View>
    </HOCView>
  );
};

export default SearchDropdownBoxModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundColor,
    flex: 1,
  },
});
