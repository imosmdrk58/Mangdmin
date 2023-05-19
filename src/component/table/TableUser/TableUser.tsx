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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import './TableUser.scoped.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faL, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
const _ = require('lodash');

type Order = 'asc' | 'desc';

interface HeadCell {
  id: string;
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
    id: 'avatar',
    sort: false,
    label: 'Ảnh đại diện',
  },
  {
    id: 'fullname',
    sort: true,
    label: 'Họ và tên',
  },
  {
    id: 'action',
    sort: false,
    label: 'Thao tác',
  },
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
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
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
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

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
          Danh sách user
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

export class EnhancedTable extends React.Component<any, any> {
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
    };

    this.setOrder = this.setOrder.bind(this);
    this.setOrderBy = this.setOrderBy.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.setPage = this.setPage.bind(this);
    this.setRowsPerPage = this.setRowsPerPage.bind(this);
    this.setRows = this.setRows.bind(this);
  }

  async componentDidMount() {
    this.setState({
      emptyRows: this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - this.state.rows.length) : 0,
      isSelected: (name: string) => this.state.selected.indexOf(name) !== -1,
    })

    const query = `
    query {
      getAllUser {
           id,
        fullname,
        avatar,
        role,
        email,
        active,
        }
    }
    `;

    const response = await fetch(`http://localhost:3000/graphql`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query
      })
    })
      .then(r => r.json())

    this.setState({
      all_data: response.data.getAllUser,
    }, () => {
      this.setRows();
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

  banUser = async (id_user: number) => {
    // eslint-disable-next-line no-restricted-globals
    const agree = confirm(`Bạn có chắc muốn 'ban' người dùng với id ${id_user} này không?`);

    if (agree) {
      fetch(`http://localhost:3000/api/user/management/2?ban=true`)
        .then(async (response) => {
          const json_response = await response.json();

          json_response.success ? toast.success(json_response.message.toString()) : toast.success(json_response.message.toString());
        });

      const update_rows = this.state.rows;
      // eslint-disable-next-line array-callback-return
      update_rows.map((row: any) => {
        if (row.id === id_user) {
          row.active = false;
        }
      })

      this.setState({
        rows: update_rows,
      });
    }
  }

  unbanUser = async (id_user: number) => {
    // eslint-disable-next-line no-restricted-globals
    const agree = confirm(`Bạn có chắc muốn 'unban' người dùng với id ${id_user} này không?`);

    if (agree) {
      fetch(`http://localhost:3000/api/user/management/2?ban=false`)
        .then(async (response) => {
          const json_response = await response.json();

          json_response.success ? toast.success(json_response.message.toString()) : toast.success(json_response.message.toString());
        });

      const update_rows = this.state.rows;
      // eslint-disable-next-line array-callback-return
      update_rows.map((row: any) => {
        if (row.id === id_user) {
          row.active = true;
        }
      })

      this.setState({
        rows: update_rows,
      });
    }
  }

  render(): React.ReactNode {
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={this.state.selected.length} />
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
                  const isItemSelected = this.state.isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => this.handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align='center'
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="center">
                        <img className='row-thumb' src={row.avatar ? `${row.avatar}` : ''} alt="" />
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
                      <TableCell align="center">
                        <div className='row-action'>
                          {
                            row.active ? <Button color="error" variant="contained" onClick={() => this.banUser(row.id)}>
                              <FontAwesomeIcon icon={faBan} />
                            </Button>
                              : <Button color="success" variant="contained" onClick={() => this.unbanUser(row.id)}>
                                <FontAwesomeIcon icon={faLockOpen} />
                              </Button>
                          }
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