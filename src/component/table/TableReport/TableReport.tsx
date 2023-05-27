import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import './TableReport.scoped.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import { CustomInput } from '../../Search/Search';
import { toast } from 'react-toastify';
import { API_getReports, API_markSolved, API_searchComic } from '../../../service/CallAPI';
import { toast_config } from '../../../config/toast.config';
const _ = require('lodash');

type Order = 'asc' | 'desc';

interface HeadCell {
  id: any;
  sort: boolean;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    sort: true,
    label: 'id',
  },
  {
    id: 'type',
    sort: true,
    label: 'Loại',
  },
  {
    id: 'email',
    sort: true,
    label: 'Người báo cáo',
  },
  {
    id: 'errors',
    sort: false,
    label: 'Lỗi',
  },
  {
    id: 'is_resolve',
    sort: true,
    label: 'Tình trạng',
  },
  {
    id: 'action',
    sort: false,
    label: 'Thực hiện'
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {
              headCell.sort ?
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel> :
                <div>
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </div>
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  searchComic: Function;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  const searchComic = async (event: any) => {
    const key_press = event.code || event.key;
    if (key_press === 'Enter') {
      props.searchComic(event.target.value);
    }
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <div className='header-table-search'>
            <span>Danh sách báo cáo</span>
            <CustomInput placeholder="Nhập id lỗi…" onKeyDown={searchComic} />
          </div>
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export class TableReport extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'id',
      selected: [],
      page: 0,
      rowsPerPage: 10,
      all_data: [],
      rows: [],
      emptyRows: 0,
      isSelected: 0,
      is_show_dialog_information: false,
      detail_comic: {},
    };

    this.setOrder = this.setOrder.bind(this);
    this.setOrderBy = this.setOrderBy.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.setPage = this.setPage.bind(this);
    this.setRowsPerPage = this.setRowsPerPage.bind(this);
    this.setRows = this.setRows.bind(this);
    this.searchComic = this.searchComic.bind(this);
  }

  async componentDidMount() {
    this.setState({
      emptyRows: this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - this.state.rows.length) : 0,
      isSelected: (name: string) => this.state.selected.indexOf(name) !== -1,
    })

    await API_getReports()
      .then(async (response) => {
        const json_response = await response.json();

        this.setState({
          all_data: json_response.data.getReports,
        }, () => {
          this.setRows();
        });
      })
  }

  setOrder(value: string) {
    this.setState({
      order: value,
    });
  }

  setOrderBy(value: string) {
    this.setState({
      orderBy: value,
    });
  }

  setSelected(value: any) {
    this.setState({
      selected: value,
    })
  }

  setPage(value: number) {
    this.setState({
      page: value,
    });
  }

  setRowsPerPage(value: number) {
    this.setState({
      rowsPerPage: value,
    });
  }

  async setRows() {
    this.setState({
      rows: this.state.all_data.slice(this.state.page * this.state.rowsPerPage, this.state.rowsPerPage * (this.state.page + 1)),
    }, () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  searchComic = async (search_name: string) => {
    await API_searchComic({ search_name: search_name, }).then(async (response) => {
      const data = await response.json();

      this.setState({
        all_data: data.result,
      }, () => {
        this.setRows();
      });
    })
  }

  sortAllData = async () => {
    this.setState({
      all_data: _.orderBy(this.state.all_data, [this.state.orderBy], [this.state.order]),
    });
  }

  handleRequestSort = async (
    event: React.MouseEvent<unknown>,
    property: any,
  ) => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc';
    await this.setOrder(isAsc ? 'desc' : 'asc');
    await this.setOrderBy(property);
    await this.sortAllData();
    this.setRows();
  };

  handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = this.state.rows.map((n: any) => n.name);
      this.setSelected(newSelected);
      return;
    }
    this.setSelected([]);
  };

  handleClick = (event: React.MouseEvent<unknown>, name: any) => {
    const selectedIndex = this.state.selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(this.state.selected.slice(1));
    } else if (selectedIndex === this.state.selected.length - 1) {
      newSelected = newSelected.concat(this.state.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        this.state.selected.slice(0, selectedIndex),
        this.state.selected.slice(selectedIndex + 1),
      );
    }

    this.setSelected(newSelected);
  };

  handleChangePage = async (event: unknown, newPage: number) => {
    await this.setPage(newPage);
    this.setRows();
  };

  handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await this.setRowsPerPage(parseInt(event.target.value));
    await this.setPage(0);
    this.setRows();
  };

  markSolved = (id_report: number) => {
    this.setState({
      // eslint-disable-next-line array-callback-return
      rows: this.state.rows.map((ele: any) => {
        if (ele.id === id_report) {
          ele.is_resolve = true;
          return ele;
        }
      }),
    });

    API_markSolved(id_report, true)
      .then(async (response) => {
        const json_response = await response.json();

        if (json_response.success) {
          toast.success(json_response.message.toString(), toast_config);
        }
      })
  }

  render(): React.ReactNode {
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={this.state.selected.length} searchComic={this.searchComic} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                numSelected={this.state.selected.length}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={this.state.rows.length}
              />
              <TableBody>
                {this.state.rows.map((row: any, index: number) => {
                  const isItemSelected = this.state.isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={(event) => this.handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="left">
                        {row.type}
                      </TableCell>
                      <TableCell align="left">
                        <div className='row-information'>
                          <div className='row-information-item'>
                            <span className='label'>Tên:</span>
                            <span className='content'>{row.fullname}</span>
                          </div>
                          <div className='row-information-item'>
                            <span className='label'>Email:</span>
                            <span className='content'>{row.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className='row-information'>
                          <div className='row-information-item'>
                            <span className='label'>Danh sách lỗi:</span>
                            <span className='content content-array'>
                              {
                                row.errors.length !== 0 ? row.errors && row.errors.map((error: any, index: number) => (
                                  <span key={index} style={{ marginRight: '5px' }}>{error}</span>
                                )) : <span>Đang cập nhật</span>
                              }
                            </span>
                          </div>
                          <div className='row-information-item'>
                            <span className='label'>Mô tả:</span>
                            <span className='content'>{row.detail_report}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        {row.is_resolve ?
                          <span className='report-state' style={{ color: 'green', fontWeight: 'bold', }}>Đã xử lý</span>
                          : <span className='report-state' style={{ color: 'red', fontWeight: 'bold', }}>Chưa xử lý</span>}
                      </TableCell>
                      <TableCell align="center">
                        <div className='row-action'>
                          {row.is_resolve ?
                            <Button disabled title='Đánh dấu đã xử lý' color="success" variant="contained">
                              <FontAwesomeIcon icon={faCheck} />
                            </Button>
                            :
                            <Button title='Đánh dấu đã xử lý' color="success" variant="contained" onClick={() => this.markSolved(row.id)}>
                              <FontAwesomeIcon icon={faCheck} />
                            </Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={this.state.all_data.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onPageChange={this.handleChangePage}
            onRowsPerPageChange={this.handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    );
  }
}