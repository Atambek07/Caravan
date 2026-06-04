import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatPrice } from '@/utils/format';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, comment, setComment, total } = useCartStore();

  if (!items.length) {
    return (
      <>
        <BreadcrumbsNav items={[{ label: 'Корзина' }]} />
        <Typography>Корзина пуста. <Link to="/catalog">Перейти в каталог</Link></Typography>
      </>
    );
  }

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Корзина' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Корзина</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Товар</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Кол-во</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((i) => (
              <TableRow key={i.product.id}>
                <TableCell>{i.product.name}</TableCell>
                <TableCell>{formatPrice(i.product.price)}</TableCell>
                <TableCell>
                  <TextField type="number" size="small" value={i.quantity} onChange={(e) => updateQuantity(i.product.id, Number(e.target.value))} inputProps={{ min: 1 }} sx={{ width: 80 }} />
                </TableCell>
                <TableCell>{formatPrice(parseFloat(i.product.price) * i.quantity)}</TableCell>
                <TableCell><IconButton onClick={() => removeItem(i.product.id)}><DeleteIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <TextField fullWidth label="Комментарий к заказу" multiline rows={2} value={comment} onChange={(e) => setComment(e.target.value)} sx={{ mt: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <Typography variant="h6">Итого: {formatPrice(total())}</Typography>
        <Button component={Link} to="/checkout" variant="contained" size="large">Оформить заказ</Button>
      </Box>
    </>
  );
};
