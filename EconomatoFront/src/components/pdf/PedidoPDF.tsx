import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logoSmart from '../../assets/logoTransparet.png';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#2d3748',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  logo: {
    width: 80,
  },
  headerInfo: {
    textAlign: 'right',
  },
  headerTag: {
    fontSize: 7,
    letterSpacing: 2,
    color: '#a0aec0',
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  titleSection: {
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a202c',
    letterSpacing: -0.5,
  },
  titleBorder: {
    marginTop: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    width: '100%',
  },

  metaTable: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    marginBottom: 50,
  },
  metaCol: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: '#e2e8f0',
    padding: 10,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: 6.5,
    textTransform: 'uppercase',
    color: '#a0aec0',
    marginBottom: 3,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  
  sectionTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#1a202c',
    marginBottom: 20,
    paddingBottom: 4,
    width: 130, 
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9', 
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
   
  },
  tableHeaderCell: {
    color: '#475569',
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
    padding: 8,
    alignItems: 'center',
  },
  tableRowAlternate: {
    backgroundColor: '#fafafa', 
  },
  // Columnas proporcionales
  colDesc: { width: '55%' },
  colCant: { width: '15%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  // --- FOOTER ---
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 6.5,
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});

export const PedidoPDF = ({ pedido, catalogoProductos, tipoPedido }: any) => {
  // Determinamos qué array de líneas usar según el tipo de pedido
  const lineas = tipoPedido === 'productos' 
    ? pedido.pedido_ingrediente || [] 
    : pedido.pedido_material || [];

  return (
    <Document title={`Orden de Pedido - ${pedido.id_pedido || 'Nuevo'}`}>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header} fixed>
          <Image src={logoSmart} style={styles.logo} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTag}> Hoja de Pedido</Text>
          </View>
        </View>

        {/* TÍTULO PRINCIPAL CON LÍNEA DIVISORIA */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            {pedido.id_pedido ? `Pedido ${pedido.id_pedido}` : "Nuevo Pedido"}
          </Text>
          <View style={styles.titleBorder} />
        </View>

        {/* TABLA DE DATOS CABECERA (CENTRADOS) */}
        <View style={styles.metaTable}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Proveedor</Text>
            <Text style={styles.metaValue}>{pedido.proveedor || "Pendiente"}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Fecha Emisión</Text>
            <Text style={styles.metaValue}>
              {pedido.fecha_pedido 
                ? new Date(pedido.fecha_pedido).toLocaleDateString('es-ES') 
                : new Date().toLocaleDateString('es-ES')}
            </Text>
          </View>
          <View style={[styles.metaCol, { borderRightWidth: 0 }]}>
            <Text style={styles.metaLabel}>Total Estimado</Text>
            <Text style={styles.metaValue}>
              {Number(pedido.total_estimado ?? 0).toFixed(2)}€
            </Text>
          </View>
        </View>

        {/* TABLA DE PRODUCTOS PROFESIONAL */}
        <Text style={styles.sectionTitle}>Detalle de Artículos</Text>
        
        <View style={styles.table}>
          {/* Cabecera Tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.tableHeaderCell, styles.colCant]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>P. Unit</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Subtotal</Text>
          </View>

          {/* Filas dinámicas */}
          {lineas.map((linea: any, i: number) => {
            const itemId = tipoPedido === 'productos' ? linea.id_ingrediente : linea.id_material;
            const prod = catalogoProductos.find((p: any) => p.id === itemId);
            const subtotal = (prod?.precio || 0) * (linea.cantidad_solicitada || 0);

            return (
              <View key={i} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlternate : {}]}>
                <Text style={[styles.colDesc, { color: '#4a5568', fontWeight: 'medium' }]}>
                  {prod?.nombre || "Cargando..."}
                </Text>
                <Text style={styles.colCant}>{linea.cantidad_solicitada || 0}</Text>
                <Text style={styles.colPrice}>{Number(prod?.precio || 0).toFixed(2)}€</Text>
                <Text style={[styles.colTotal, { fontWeight: 'bold' }]}>{subtotal.toFixed(2)}€</Text>
              </View>
            );
          })}
        </View>

        {/* PIE DE PÁGINA INSTITUCIONAL */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Gobierno de Canarias</Text>
          <Text style={styles.footerText}>CEIP Virgen del Carmen</Text>
        </View>

      </Page>
    </Document>
  );
};