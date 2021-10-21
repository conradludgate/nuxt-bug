import { defineNuxtConfig } from 'nuxt3'
import { defineNuxtModule, addVitePlugin, addWebpackPlugin } from '@nuxt/kit'
import { createUnplugin } from 'unplugin'
import { compile } from '@mdx-js/mdx';

const mdxLoader = createUnplugin(() => ({
    name: 'nuxt-mdx-loader',
    enforce: "pre",
    transformInclude(id) {
        return id.endsWith('.mdx')
    },
    async transform(code) {
        const result = await compile({value: code});
        return result.toString()
    }
}))

export default defineNuxtConfig({
    buildModules: [
        defineNuxtModule({
            name: "mdx",
            setup(options, nuxt): void | Promise<void> {
                const { extensions } = nuxt.options
                if (extensions && !extensions.includes('.mdx')) {
                    extensions.push('.mdx')
                }

                addWebpackPlugin(mdxLoader.webpack())
                addVitePlugin(mdxLoader.vite())
            }
        })
    ]
})
