const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:"development", /*development,production*/
    entry:"./src/js/index.ts" , 
    resolve: {
      extensions: ['.ts', '.js'],
    },

    output:{
      filename:'js/index.js?[hash]',
      path:path.resolve(__dirname , "dist") , 
      clean:true
    },
    plugins:[  
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname ,"src/index.html") ,
            filename:'index.html' ,
            inject:'body'
        }) ,
    ] , 
    devtool: 'source-map', 
    devServer: {
      static: {
        directory: path.join(__dirname, '/dist'),
      },
      compress: true,
      port: 9000,
      open: true,
      hot: true,
      watchFiles: ['src/**/*']    
    },
     
    /*
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
            },
          },
      },*/
    module:{
        rules:[
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test:/\.css/i,
            use:["style-loader" , "css-loader"]
        },
        {
            test:/\.(png|svg|jpg|jpeg|gif)$/i , 
            type:'asset/resource',
            generator: { filename: 'static/images/[hash][ext][query]'  }
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
            generator: {filename: 'font/[hash][ext][query]' }
        } , ]
    }
}