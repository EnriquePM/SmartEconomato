import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logoSmart from '../assets/logoTransparet.png';

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
    marginBottom: 50,
  },
  logo: {
    width: 80,
    filter: 'grayscale(100%)', 
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
    marginBottom: 35,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a202c',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  metaGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
    paddingTop: 15,
    gap: 30,
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: 6.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#718096',
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4a5568',
  },


  ingredientsSection: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#1a202c',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a202c',
    paddingBottom: 4,
    width: 130, 
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
  },
  ingredientItem: {
    width: '47%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f7fafc',
  },

 
  instructionsSection: {
    marginTop: 10,
  },
  instructionText: {
    fontSize: 9.5,
    lineHeight: 1.7,
    textAlign: 'justify',
    color: '#4a5568',
  },


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

export const RecetaPDF = ({ receta }: any) => (
  <Document title={`Ficha Técnica - ${receta.nombre}`}>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.header} fixed>
        <Image src={logoSmart} style={styles.logo} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTag}>Ficha Técnica de Receta</Text>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>{receta.nombre}</Text>
        
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Autor</Text>
            <Text style={styles.metaValue}>{receta.usuario_nombre || "Chef de Ejemplo"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Fecha</Text>
            <Text style={styles.metaValue}>{new Date().toLocaleDateString('es-ES')}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Rendimiento</Text>
            <Text style={styles.metaValue}>{receta.cantidad_platos} Pax</Text>
          </View>
        </View>
      </View>

      <View style={styles.ingredientsSection}>
        <Text style={styles.sectionLabel}>Ingredientes</Text>
        <View style={styles.ingredientsGrid}>
          {receta.receta_ingrediente?.map((item: any, i: number) => (
            <View key={i} style={styles.ingredientItem}>
              <Text style={{ color: '#718096', width: '70%' }}>
                {item.ingrediente?.nombre || item.nombre}
              </Text>
              <Text style={{ fontWeight: 'bold', width: '30%', textAlign: 'right' }}>
                {item.cantidad} {item.ingrediente?.unidad_medida || item.unidad || ''}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.instructionsSection}>
        <Text style={styles.sectionLabel}>Método de Elaboración</Text>
        <Text style={styles.instructionText}>
          {receta.description || receta.descripcion || "Procedimiento estándar no definido."}
        </Text>
      </View>

      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Gobierno de Canarias</Text>
        <Text style={styles.footerText}>CEIP Virgen del Carmen</Text>
      </View>

    </Page>
  </Document>
);