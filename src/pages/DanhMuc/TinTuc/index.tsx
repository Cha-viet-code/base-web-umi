/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Popover, Select, Tooltip } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewTinTuc from './components/ViewTinTuc';

const TinTuc = () => {
  const {
    loading,
    chuDe,
    getTinTucModel,
    setEdit,
    setVisibleForm,
    delTinTucModel,
    setRecord,
    page,
    limit,
    setChuDe,
    setCondition,
    condition,
    filterInfo,
  } = useModel('tintuc');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [recordTT, setRecordTT] = useState<TinTuc.Record>({} as TinTuc.Record);
  const { getAllChuDeModel, danhSach } = useModel('chude');

  const handleEdit = (record: TinTuc.Record) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<TinTuc.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      width: 200,
      search: 'search',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 200,
    },
    {
      title: 'Chủ đề',
      dataIndex: ['idTopic', 'name'],
      align: 'center',
      width: 200,
    },
    {
      title: 'Người đăng',
      dataIndex: ['nguoiDang', 'fullname'],
      align: 'center',
      width: 200,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'ngayDang',
      render: (val) => <div>{moment(val).format('DD/MM/YYYY')}</div>,
      align: 'center',
      width: 100,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record) => (
        <Popover
          content={
            <>
              <Tooltip title="Xem chi tiết">
                <Button
                  onClick={() => {
                    setVisibleModal(true);
                    setRecordTT(record);
                  }}
                  type="primary"
                  shape="circle"
                >
                  <EyeOutlined />
                </Button>
              </Tooltip>{' '}
              <Divider type="vertical" />
              <Tooltip title="Chỉnh sửa">
                <Button onClick={() => handleEdit(record)} type="default" shape="circle">
                  <EditOutlined />
                </Button>
              </Tooltip>{' '}
              <Divider type="vertical" />
              <Tooltip title="Xóa">
                <Popconfirm
                  onConfirm={() => delTinTucModel({ id: record._id })}
                  title="Bạn có chắc chắn muốn xóa chủ đề này"
                >
                  <Button type="primary" shape="circle">
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </Tooltip>
            </>
          }
        >
          <Button type="primary" icon={<EditOutlined />} />
        </Popover>
      ),
    },
  ];

  useEffect(() => {
    getAllChuDeModel();
  }, []);

  const onChangeLoaiTinTuc = (value: string) => {
    setChuDe(value);
    setCondition({ ...condition, idTopic: value === 'Tất cả' ? undefined : value });
  };

  return (
    <TableBase
      columns={columns}
      getData={getTinTucModel}
      loading={loading}
      dependencies={[chuDe, page, limit, condition, filterInfo]}
      modelName="tintuc"
      formType="Drawer"
      widthDrawer="60%"
      title="Quản lý tin tức"
      Form={Form}
      hascreate
    >
      <Select
        onChange={onChangeLoaiTinTuc}
        value={chuDe}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        <Select.Option value="Tất cả">Tất cả</Select.Option>
        {danhSach?.map((item: ChuDe.Record) => (
          <Select.Option key={item._id} value={item._id}>
            {item?.name}
          </Select.Option>
        ))}
      </Select>
      <Modal
        width="80%"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button onClick={() => setVisibleModal(false)} type="primary">
            Đóng
          </Button>
        }
        onCancel={() => setVisibleModal(false)}
        visible={visibleModal}
      >
        <ViewTinTuc record={recordTT} />
      </Modal>
    </TableBase>
  );
};

export default TinTuc;
